/// <reference lib="webworker" />
import { Preferences } from '@capacitor/preferences';
import { MessageResponse, MessageRequest, Attackable, Defendable, MessageRequestType } from './models';
import * as ActorUtil from './utils/actor-util';
import * as SysUtil from './utils/system-util';
import * as FightUtil from './utils/fight-utils';








addEventListener('message', ({ data }: { data: MessageRequest } ) => {
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
      let _acct = data.data.primary[0]
      const _defender = FightUtil.processFight(_acct, data.data.secondary![0])
      
      // check if the defender is dead... if not they fight back
      if (!ActorUtil.isActorDead(_defender)) {
        _acct = FightUtil.processFight(_defender, _acct);
      }

      reply.data.primary.push(_acct);
      reply.data.secondary = [_defender];
      reply.status = true;
      break;
    case MessageRequestType.REST:
      const heal_cost = data.data.primary.reduce((c, p) => c + (p.fullHealth - p.health), 0)
      if (!data.data.force) {
        if (!data.data.bank || data.data.bank.coin < heal_cost) {
          reply.data.primary.push(...data.data.primary);
          reply.messages.push(`Not enough money to fully heal.`);
          break;
        }
        if (data.data.bank) {
          reply.data.bank = SysUtil.clone(data.data.bank);
          reply.data.bank.coin -= BigInt(heal_cost);
        }
      }
      reply.data.primary.push(...data.data.primary.map(p => {
        const prtn = SysUtil.clone(p);
        prtn.health = prtn.fullHealth;
        return prtn;
      }));
      break;
  }

  postMessage(reply);
});
