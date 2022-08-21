import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { GameMechanicsService } from '../../game-mechanics.service';
import { Bank, Hero, Item, ItemType } from '../../models';
import { Sack } from '../../models/sack';

@Component({
  selector: 'app-spec-popup',
  templateUrl: './spec-popup.component.html',
  styleUrls: ['./spec-popup.component.scss']
})
export class SpecPopupComponent implements OnInit, OnChanges {

  @ViewChild(IonModal) modal!: IonModal;

  @Input()
  public hero!: Hero;

  @Input()
  public bank!: Bank;

  @Input()
  public isOpen: boolean = false;

  public sack?: Sack;

  @Output()
  public dismissed = new EventEmitter<any>();

  public activeTab: string = 'sack';

  constructor(private gameMec: GameMechanicsService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hero']) {
      this.sack = (changes['hero'].currentValue as Hero)?.sack;
    }
  }

  ngOnInit(): void {
  }

  public confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  public cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  public onWillDismiss(e: Event): void {
    this.dismissed.next(null);
  }

  public usable(e: Item): boolean {
    return [ItemType.IMPROVE, ItemType.HEALTH].indexOf(e.type) > -1;
  }

  public attachable(e: Item): boolean {
    return [ItemType.ATTACK].indexOf(e.type) > -1;
  }

  public processItem(e: Item): void {
    const idx = this.hero.sack.items.findIndex(i => i === e);
    if (idx > -1) {
      this.hero.sack.items.splice(idx, 1);
    }
    this.gameMec.processItem(e, this.hero);
  }

  public attachItem(e: Item): void {
    const idx = this.hero.sack.items.findIndex(i => i === e);
    if (idx > -1) {
      const itmArr = this.hero.sack.items.splice(idx, 1);
      this.hero.attached.push(...itmArr);
      this.gameMec.updatePlayer(this.hero)
    }
  }

  public changeProperty(dir: '+' | '-', prop: 'h' | 'a' | 'd'): void {
    if (!this.hero.property ||
      !this.hero.property['assignable'] ||
      this.hero.property!['assignable'] < 0) {
      return;
      }
    if (dir === '+') {
      
      switch (prop) {
        case 'h':
          this.hero.property!['assignable']--;
          this.hero.fullHealth += 10;
          break;
        case 'd':
          this.hero.property!['assignable']--;
          this.hero.defence++;
          break;
        case 'a':
          this.hero.property!['assignable']--;
          this.hero.attack++;
          break;
      }
    }
  }
}
