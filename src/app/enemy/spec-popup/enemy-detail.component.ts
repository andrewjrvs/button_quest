import { Component, Input, OnInit } from '@angular/core';
import { Villan } from '../../models';

@Component({
  selector: 'app-enemy-detail',
  templateUrl: './enemy-detail.component.html',
  styleUrls: ['./enemy-detail.component.scss']
})
export class EnemyDetailComponent implements OnInit {

  @Input()
  public enemy!: Villan;
  
  constructor() { }

  ngOnInit(): void {
  }

}
