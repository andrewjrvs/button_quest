import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  public hero!: Hero

  constructor() { }

  ngOnInit(): void {
  }

}
