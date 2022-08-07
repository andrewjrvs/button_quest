import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-player-health',
  templateUrl: './player-health.component.html',
  styleUrls: ['./player-health.component.scss']
})
export class PlayerHealthComponent implements OnInit {


  @Input()
  public player!: Player

  constructor() { }

  ngOnInit(): void {
  }

}
