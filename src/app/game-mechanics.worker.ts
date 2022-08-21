/// <reference lib="webworker" />
import { MessageResponse, MessageRequest, MessageRequestType, Actor, Item, ItemType } from './models';
import * as ActorUtil from './utils/actor-util';
import * as SysUtil from './utils/system-util';
import * as FightUtil from './utils/fight-utils';
import * as LvlUtil from './utils/leveling-util';
import { Sack } from './models/sack';

function processRest(primaryList: Actor[], sack: Sack | undefined, bank: Sack | undefined,  isForce: boolean = false): { rsp: Actor[], sack: Sack | undefined, bank: Sack | undefined, messages: string[] } {
  const fullCoin = 0n + (sack?.coin || 0n) + (bank?.coin || 0n);
  const rplyPrimaryLst: Actor[] = [];
  const rplySack: Sack | undefined = sack ? { ...sack } : undefined;
  const rplyBank: Sack | undefined = bank ? { ...bank } : undefined;
  const messages: string[] = [];
  
  //let heal_amount = primaryList.reduce((c, p) => c + (p.fullHealth - p.health), 0);
  // Currently only works on Person 1
  let heal_amount = primaryList[0].fullHealth - primaryList[0].health;
  
  let heal_cost = BigInt(heal_amount);
  let okToHeal = isForce;
  
  if (!isForce) {
    if (fullCoin < heal_cost) {
      messages.push(`Not enough money to fully heal.`);
      heal_amount = Number(fullCoin);
      heal_cost = fullCoin;
    }
    
    if (rplySack) {
      if (rplySack.coin >= heal_cost) {
        rplySack.coin -= heal_cost;
        heal_cost = 0n;
        okToHeal = true;
      } else {
        heal_cost -= rplySack.coin;
        rplySack.coin = 0n;
      }
      if (rplyBank && heal_cost > 0n) {
        okToHeal = true;
        rplyBank.coin -= heal_cost;
      }
    }
  }

  if (!okToHeal) {
    return {
      rsp: primaryList
      , messages
      , sack: sack
      , bank: bank
    };
  }

  rplyPrimaryLst.push(...primaryList.map((p, i) => {
    const prtn = SysUtil.clone(p);
    if (i === 0) {
      prtn.health += heal_amount;
    } 
    return prtn;
  }));
  return {
    rsp: rplyPrimaryLst
    , messages
    , sack: rplySack
    , bank: rplyBank
  }
}

function processItem(item: Item, primary: Actor[], secondary?: Actor[], isForce: boolean = false): { primary: Actor[], secondary?: Actor[] } {
  const rtnContent: { primary: Actor[], secondary?: Actor[] } = {
    primary: []
  }
  let hRtnPrimary = { ...primary[0] } as Actor;
  // Check item type?
  switch (item.type) {
    case ItemType.HEALTH:
      // heal based on the size
      
      console.log('processing health', item);
      switch (item.subType) {
        case 'f':
          hRtnPrimary.health = hRtnPrimary.fullHealth;
          break;
        case 'm':
          hRtnPrimary.health += 500;
          break;
        default:
          hRtnPrimary.health += 100;
      }
      if (!isForce) {
        hRtnPrimary.health = Math.min(hRtnPrimary.health, hRtnPrimary.fullHealth);
      }
      rtnContent.primary.push(hRtnPrimary);
      break;
    case ItemType.ATTACK:
      switch (item.subType) {
        case 'X':
          if (secondary) {
            rtnContent.secondary = secondary.map(s => {
              const rtn = { ...s } as Actor
              rtn.health -= 100;
              return rtn;
            });
            // TODO: process isActorDead...
          }
      }
      break;
    case ItemType.IMPROVE:
      const impv = parseInt(item.key.slice(2), 10);
      switch (item.subType) {
        case 'h':
          hRtnPrimary.fullHealth += impv * 10;
          break;
        case 'd':
          hRtnPrimary.defence += impv;
          break;
        case 'a':
          hRtnPrimary.attack += impv;
          break;
      }
      rtnContent.primary.push(hRtnPrimary);
      break;
  }

  return rtnContent;
}

addEventListener('message', ({ data }: { data: MessageRequest }) => {
  const reply: MessageResponse = {
    requestType: data.type
    , data: {
      primary: []
    }
    , messages: []
    , status: false
  };

  switch (data.type) {
    case MessageRequestType.FIGHT:
      // for now we are going to use the first items of both the primary 
      // and secondary...
      let _acct = { ...data.data.primary[0] };
      const _defender = FightUtil.processFight(_acct, data.data.secondary![0])

      // check if the defender is dead... if not they fight back
      if (!ActorUtil.isActorDead(_defender)) {
        _acct = FightUtil.processFight(_defender, _acct);
      } else {

        // I'm debating where the 'experience' / after fight happens...
        // for now we will do it here...
        _acct.experience += LvlUtil.calculateChallengeExperience(_acct, _defender);
        console.log('checking exp', _acct.experience, data.data.primary[0].experience, _acct.experience > data.data.primary[0].experience);
        if (_acct.experience > data.data.primary[0].experience) {
          const nxtlvl = LvlUtil.findLevelFromExperience(_acct.experience);
          console.log('running exp', _acct.experience, _acct.level, nxtlvl)
          if (_acct.level != nxtlvl) {
            _acct = LvlUtil.levelUpPlayer(_acct, nxtlvl);
          }
        }

        // get's the content from the players bag...
        _acct.sack.coin += _defender.sack.coin;

        // get items from attach
        if (_acct.sack.limit >= _acct.sack.items.length + _defender.attached.length) {
          _acct.sack.items.push(..._defender.attached);
          _defender.attached.length = 0;
        }

        // get items from sack
        if (_acct.sack.limit >= _acct.sack.items.length + _defender.sack.items.length) {
          _acct.sack.items.push(..._defender.sack.items);
          _defender.sack.items.length = 0;
        }

      }

      reply.data.primary.push(_acct);
      reply.data.secondary = [_defender];
      reply.status = true;
      break;
    case MessageRequestType.REST:
      const restRsp = processRest(data.data.primary, data.data.primary[0].sack, data.data.bank, data.data.force)

      reply.data.primary.push(...restRsp.rsp);
      if (restRsp.sack) {
        reply.data.primary[0].sack = restRsp.sack;
      }
      if (restRsp.bank) {
        reply.data.bank = restRsp.bank;
      }

      reply.status = true;
      if (restRsp.messages && restRsp.messages.length) {
        reply.status = false;
        reply.messages.push(...restRsp.messages);
      }

      break;
    case MessageRequestType.LEVELUP:
      reply.data.primary.push(...data.data.primary.map(p => {
        return LvlUtil.levelUpPlayer(p);
      }));
      break;
    case MessageRequestType.DEATH:
      // first, lets see if they have an AFTER DEATH item..
      let axt: number;
      if ((axt = data.data.primary[0].sack.items.findIndex(x => x.type === ItemType.AFTERDEATH)) &&
        axt > 0 &&
        data.data.primary[0].sack.items[axt].subType == 'hs') {
        reply.data.primary.push(...data.data.primary.map((p, i) => {
          const xhro = { ...p } as Actor;
          if (i === 0) {
            xhro.sack.items.splice(axt, 1);
          }
          return xhro;
        }))
        // don't process the death yet...
        break;
      }

      const deathRsp = processRest(data.data.primary, data.data.primary[0].sack, data.data.bank, true);

      // when you die... you lose ALL your money? or just half.. hmm..
      deathRsp.rsp[0].sack.coin = deathRsp.rsp[0].sack.coin / 2n;

      // you also half of the difference of your base experince and running experience
      const deathExpDif = deathRsp.rsp[0].experience - (deathRsp.rsp[0].currentBreakpoint || 0n);
      deathRsp.rsp[0].experience -= deathExpDif > 0n ? (deathExpDif / 2n) : 0n;

      reply.data.primary.push(...deathRsp.rsp);
      reply.status = true;
      break;
    case MessageRequestType.ITEM:
      const itemRply = processItem(data.data.item!, data.data.primary, data.data.secondary, data.data.force);
      reply.data.primary.push(...itemRply.primary);
      if (itemRply.secondary) {
        reply.data.secondary = [...itemRply.secondary];
      }
      reply.status = true;
      break;
  }

  postMessage(reply);
});
