import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Villan } from '../models';
import { EnemyType, subType } from '../models/enemy-type';
import { getVillanDisplayIndex } from '../utils/image-util';


@Component({
  selector: 'app-display-icon',
  templateUrl: './display-icon.component.html',
  styleUrls: ['./display-icon.component.scss']
})
export class DisplayIconComponent implements OnInit, OnChanges {
  @HostBinding("style.--enemy-display-index")
  public image_index: string = ''



  @Input()
  public enemy!: Villan;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enemy']) {
      this.image_index = getVillanDisplayIndex(this.enemy);
    }
  }

  ngOnInit(): void {
  }

}
