import { Component, Input, OnInit } from '@angular/core';
import { Enemy } from '../models/emeny';

@Component({
  selector: 'app-enemy',
  templateUrl: './enemy.component.html',
  styleUrls: ['./enemy.component.scss']
})
export class EnemyComponent implements OnInit {

  @Input()
  public enemy!: Enemy;

  constructor() { }

  ngOnInit(): void {
  }

}
