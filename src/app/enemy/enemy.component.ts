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
  
  constructor() { }

  ngOnInit(): void {
  }

}
