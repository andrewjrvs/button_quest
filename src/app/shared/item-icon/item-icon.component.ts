import { Component, HostBinding, Input, OnInit, SimpleChanges } from '@angular/core';
import { Item } from '../../models';
import { getItemDisplayIndex } from '../../utils/image-util';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss']
})
export class ItemIconComponent implements OnInit {
  @HostBinding("style.--item-display-index")
  public image_index: string = ''

  @Input()
  public item!: Item;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.image_index = getItemDisplayIndex(this.item);
    } 
  }

  ngOnInit(): void {
  }

}
