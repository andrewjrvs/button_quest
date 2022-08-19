import { Injectable } from '@angular/core';
import { Item, ItemType } from '../models';
import { Attachable } from '../models/attachable';
import * as SysUtil from '../utils/system-util';

@Injectable({
  providedIn: 'root'
})
export class ItemFactoryService {

  constructor() { }

  public getNewWeapon(lvl: number): Attachable {
    const att = SysUtil.getRandomInt(0, lvl) + 1 * (SysUtil.getRandomInt(0, 100) % 7 === 0 ? 4 : 1)
      , def = SysUtil.getRandomInt(0, 100) % 7 === 0 ? SysUtil.getRandomInt(0, lvl) + 1 : 0
      , name = `sword +${att}`
    ;
    return {
      key: this.generateKey(name, att, def, '')
      , type: ItemType.USELESS
      , improveAttack: att
      , improveDefence: def
      , name: name
    }
  }

  public generateWeapon(lvl: number): Attachable {
    const att = SysUtil.getRandomInt(0, lvl) + 1 * (SysUtil.getRandomInt(0, 100) % 7 === 0 ? 4 : 1)
      , def = SysUtil.getRandomInt(0, 100) % 7 === 0 ? SysUtil.getRandomInt(0, lvl) + 1 : 0
      , subType = ['', 'fire', 'ice'][SysUtil.getRandomInt(0, 3)]
      , name = (subType ? subType + ' ' : '') + `weapon +${att}`
      ;
    return {
      key: this.generateKey('attack', att, def, subType)
      , type: ItemType.ATTACK
      , improveAttack: att
      , improveDefence: def
      , name: name
      , subType: subType
    };
  }

  public generateDefence(lvl: number): Attachable {
    const att = SysUtil.getRandomInt(0, 100) % 7 === 0 ? SysUtil.getRandomInt(0, lvl) + 1 : 0
      , def = SysUtil.getRandomInt(0, lvl) + 1 * (SysUtil.getRandomInt(0, 100) % 7 === 0 ? 4 : 1)
      , subType = ['', 'fire'][SysUtil.getRandomInt(0, 2)]
      , name = (subType ? subType + ' ' : '') + `defence +${att}`
      ;
    return {
      key: this.generateKey('attack', att, def, subType)
      , type: ItemType.ATTACK
      , improveAttack: att
      , improveDefence: def
      , name: name
      , subType: subType
    };
  }

  private generateKey(name: string, attack: number, defence: number, subType: string): string {
    return `${name.replace('#', '').replace('~', '').replace(' ', '#').replace('|', '~')}|${attack}|${defence}|${subType}`;
  }

  private generateAttachableFromKey(key: string): Attachable {
    var [name, attack, defence] = key.split('|');
    return {
      key,
      type: ItemType.USELESS,
      name: name.replace('~', '|').replace('#', ' '),
      improveAttack: parseInt(attack || "0", 10) || 0,
      improveDefence: parseInt(defence || "0", 10) || 0
    }
  }

  public getHealthContainer(subType: 's' | 'm' | 'f'): Item {
    return {
      key: `h-${subType}`
      , type: ItemType.HEALTH
      , subType: subType
    };
  }

  public generateImproveItem(subType?: string, cnt: number = 1): Item {
    var iTpe = cnt.toString();
    var u = subType ? subType : ['a', 'h', 'd'][SysUtil.getRandomInt(0, 3)];
    return {
      key: `i-${iTpe}`
      , type: ItemType.IMPROVE
      , subType: u
    }
  }
}
