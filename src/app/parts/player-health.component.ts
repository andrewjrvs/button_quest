import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Hero } from '../models';


@Component({
  selector: 'app-player-health',
  templateUrl: './player-health.component.html',
  styleUrls: ['./player-health.component.scss']
})
export class PlayerHealthComponent implements OnInit, OnChanges  {
  @HostBinding('style.--progress-bar-bg')
  public player_health_color: string = '';
  @HostBinding('style.--player-health-warning-color')
  public hero_heart_color: string = '';

  @Input()
  public hero!: Hero

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hero']) {
      this.player_health_color = '';
      if (this.hero.health < (this.hero.fullHealth * .05)) {
        this.hero_heart_color = "#555555";
        this.player_health_color = '#b22222';
      } else if (this.hero.health < (this.hero.fullHealth * .25)) {
        this.hero_heart_color = '#ffc40c';
        this.player_health_color = '#ffc40c';
      } else {
        this.player_health_color = "#555555";
        this.hero_heart_color = '#b22222';
      }
    }
  }

  ngOnInit(): void {
  }

}
