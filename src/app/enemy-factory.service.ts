import { Injectable } from '@angular/core';
import { Enemy } from './models/emeny';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


@Injectable({
  providedIn: 'root'
})
export class EnemyFactoryService {

  constructor() { }

  public getNew(level: number): Enemy {
    return new Enemy(
      getRandomInt((1 * level) + 5, (10 * level) + 5)
      , []
      , getRandomInt((level), (level * 2))
    );
  }
}
