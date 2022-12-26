import { Component, Input, OnInit } from '@angular/core';
import { Villan } from '../models';

@Component({
  selector: 'app-enemy',
  templateUrl: './enemy.component.html',
  styleUrls: ['./enemy.component.scss']
})
export class EnemyComponent implements OnInit {

  @Input()
  public enemy!: Villan;
  
  public enemySpecs: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public openSpecs(): void {
    this.enemySpecs = true;

  }

  public specDismissed(): void {
    this.enemySpecs = false;
  }

}
