import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../models/hero';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  public player!: Player

  constructor() { }

  ngOnInit(): void {
  }

}
