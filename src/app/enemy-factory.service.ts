import { Injectable } from '@angular/core';
import { Enemy } from './models/emeny';
import { EnemyType, subType } from './models/enemy-type';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

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
export class EnemyFactoryService {

  constructor() { }


  public getNew(level: number): Enemy {
    const et = randomEnum(EnemyType);
    const ets = subType[et][getRandomInt(0, subType[et].length - 1)];
    return new Enemy(
      getRandomInt((1 * level) + 5, (10 * level) + 5)
      , et
      , ets
      , getRandomInt((level), (level * 2))
    );
  }
}
