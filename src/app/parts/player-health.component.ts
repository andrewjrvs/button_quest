import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Player } from '../models/hero';

@Component({
  selector: 'app-player-health',
  templateUrl: './player-health.component.html',
  styleUrls: ['./player-health.component.scss']
})
export class PlayerHealthComponent implements OnInit, OnChanges  {
  @HostBinding('style.--player-health-warning-color')
  public player_health_color: string = '';

  @Input()
  public player!: Player

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player']) {
      this.player_health_color = '';
      if (this.player.health < (this.player.fullHealth * .05)) {
        this.player_health_color = '#b22222'
      } else if (this.player.health < (this.player.fullHealth * .25)) {
        this.player_health_color = '#ffc40c';
      }
    }
  }

  ngOnInit(): void {
  }

}
