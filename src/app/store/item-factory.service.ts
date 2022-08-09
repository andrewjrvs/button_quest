import { Injectable } from '@angular/core';
import { Attachable } from '../models/attachable';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

@Injectable({
  providedIn: 'root'
})
export class ItemFactoryService {

  constructor() { }

  public getNewWeapon(lvl: number): Attachable {
    const att = getRandomInt(0, lvl) + 1 * (getRandomInt(0, 100) % 7 === 0 ? 4 : 1)
      , def = getRandomInt(0, 100) % 7 === 0 ? getRandomInt(0, lvl) + 1 : 0
      , name = `sword +${att}`
    ;
    return {
      key: this.generateKey(name, att, def)
      , improveAttack: att
      , improveDefence: def
      , name: name
    }
  }

  private generateKey(name: string, attack: number, defence: number): string {
    return `${name.replace('#', '').replace('~', '').replace(' ', '#').replace('|', '~')}|${attack}|${defence}`;
  }

  private generateAttachableFromKey(key: string): Attachable {
    var [name, attack, defence] = key.split('|');
    return {
      key,
      name: name.replace('~', '|').replace('#', ' '),
      improveAttack: parseInt(attack || "0", 10) || 0,
      improveDefence: parseInt(defence || "0", 10) || 0
    }
  }
}
