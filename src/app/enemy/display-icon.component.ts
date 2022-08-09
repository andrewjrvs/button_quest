import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Enemy } from '../models/emeny';
import { EnemyType, subType } from '../models/enemy-type';


function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

@Component({
  selector: 'app-display-icon',
  templateUrl: './display-icon.component.html',
  styleUrls: ['./display-icon.component.scss']
})
export class DisplayIconComponent implements OnInit, OnChanges {
  @HostBinding("style.--enemy-display-index")
  public image_index: string = ''



  private typeIndex: { [key in EnemyType]: { row: number, columns: number[] }[] } = {
    0: [{ row: 9, columns: [1, 2, 3, 4, 5, 6, 7, 8] }]
    , 1: [{ row: 9, columns: [9, 10, 11, 12, 13] }]
    , 2: [{ row: 9, columns: [14, 15, 16, 17, 18] }]
    , 3: [{ row: 11, columns: [1, 2, 3, 4] }]
    , 4: [{ row: 11, columns: [5, 6, 7] }]
    , 5: [{ row: 11, columns: [11, 12, 13, 14, 15] }]
    , 6: [{ row: 11, columns: [16] }]
    , 7: [{ row: 11, columns: [17] }]
    , 8: [{ row: 11, columns: [18] }]
  }

  @Input()
  public enemy!: Enemy;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enemy']) {
      const row = this.typeIndex[this.enemy.type][0].row * 24
      const colOps = this.typeIndex[this.enemy.type][0].columns
      const idx = subType[this.enemy.type].indexOf(this.enemy.subType)
      const col =  colOps[idx] * 24;
      this.image_index = `-${col}px -${row}px`;
    }
  }

  ngOnInit(): void {
  }

}
