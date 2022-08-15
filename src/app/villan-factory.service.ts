import { Injectable } from '@angular/core';
import { Villan } from './models';
import { EnemyType, subType } from './models/enemy-type';
import * as SysUtil from './utils/system-util';


function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}

@Injectable({
  providedIn: 'root'
})
export class VillanFactoryService {

  constructor() { }

  private calcLevelHealth(lvl: number): number {
    return SysUtil.getRandomInt(lvl * 10, lvl * 50);
  }

  private calcAttack(lvl: number): number {
    if (lvl < 5) {
      return SysUtil.getRandomInt(1, 3);
    }
    return SysUtil.getRandomInt(Math.max(lvl - 10, 1), lvl + 5)
  }

  private calcDefence(lvl: number): number {
    if (lvl < 5) {
      return SysUtil.getRandomInt(0, 2);
    }
    return SysUtil.getRandomInt(Math.max(lvl - 10, 0), lvl + 1)
  }

  private calcCoin(lvl: number): bigint {
    return BigInt(SysUtil.getRandomInt(5, lvl + 5) * SysUtil.getRandomInt(1, 30));
  }

  public getNew(level: number): Villan {
    const et = randomEnum(EnemyType);
    const ets = subType[et][SysUtil.getRandomInt(0, subType[et].length - 1)];
    const vilLvl = level < 5 ? level : SysUtil.getRandomInt(Math.max(level - 5, 1), level + 5);
    const rtn = new Villan(
      `${ets}-${vilLvl}`
      , `${ets}-${vilLvl}`
      , et
      , ets
      , this.calcLevelHealth(vilLvl)
      , vilLvl);
    rtn.attack = this.calcAttack(vilLvl);
    rtn.defence = this.calcDefence(vilLvl);
    rtn.sack.coin = this.calcCoin(vilLvl);

    return rtn;
  }
}
