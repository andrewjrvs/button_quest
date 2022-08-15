import { Component, HostBinding, Input, OnInit, SimpleChanges } from '@angular/core';
import { Hero } from '../../models';
import { getHeroDisplayIndex } from '../../utils/image-util';

@Component({
  selector: 'app-hero-icon',
  templateUrl: './hero-icon.component.html',
  styleUrls: ['./hero-icon.component.scss']
})
export class HeroIconComponent implements OnInit {

  @HostBinding("style.--hero-display-index")
  public image_index: string = ''

  @Input()
  public hero!: Hero;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hero']) {
      this.image_index = getHeroDisplayIndex(this.hero);
    }
  }

  ngOnInit(): void {
  }
}
