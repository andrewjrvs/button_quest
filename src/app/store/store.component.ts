import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attachable } from '../models/attachable';
import { ItemFactoryService } from './item-factory.service';
import { Subscription } from 'rxjs';
import { GameMechanicsService } from '../game-mechanics.service';
import { Bank, Hero, Item, ItemType } from '../models';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  public items: Item[] = [];
  public shopItems: [Attachable, number][] = [];
  
  @Input()
  public hero!: Hero;

  @Input()
  public bank?: Bank | null;

  @Input()
  public level: number = 1;

  @Output()
  public purchased = new EventEmitter<Item>();

  private storeOpened = false;

  public healthPrice = {
    's': 100n * 5n,
    'm': 500n * 5n,
    'f': 10000n * 5n
  }

  public getPrice(itm: Item): bigint {
    if (itm.type === ItemType.HEALTH) {
      return this.healthPrice[itm.subType === 's' ? 's' : itm.subType === 'm' ? 'm' : 'f'];
    }
    if (itm.type === ItemType.IMPROVE) {
      return 50000n;
    }
    if (itm.type === ItemType.ATTACK) {
      let aItm = itm as Attachable;
      let aBPrice = 500n * BigInt(aItm.improveAttack!);
      if (aItm.improveDefence!) {
        aBPrice += 1000n * BigInt(aItm.improveDefence);
      }
      if (aItm.subType !== '') {
        aBPrice += 2500n
      }
      return aBPrice;
    }
    return 1000000n;
  }

  public getItemLabel(itm: Item): string {
    let rtnLabel = 'UNSET';
    switch (itm.type) {
      case ItemType.HEALTH:
        switch (itm.subType) {
          case 'f': rtnLabel = 'Full Health'; break;
          case 'm': rtnLabel = 'Medium Health'; break;
          default: rtnLabel = 'Small Health';
        }
        break;
      case ItemType.IMPROVE:
        switch (itm.subType) {
          case 'h': rtnLabel = 'Improve Health'; break;
          case 'a': rtnLabel = 'Improve Attack'; break;
          case 'd': rtnLabel = 'Improve Defence'; break;
          default: rtnLabel = 'Unknown Improvement';
        }   
        break;
      case ItemType.ATTACK:
        rtnLabel = (itm as Attachable).name || 'Unknown';
        break;
    }

    return rtnLabel;
  }

  public unsubcribable: Subscription[] = [];

  constructor(private itemFactory: ItemFactoryService
    , private gameMec: GameMechanicsService) { }
  


  ngOnInit(): void {
    this.open();
  }
  public open(): void {
    if (this.storeOpened) {
      // the store is already open...
      return; 
    }
    
    this.storeOpened = true;

    const lvl = this.level;

    this.items.push(this.itemFactory.generateImproveItem());

    if (lvl > 50 && this.items.findIndex(x => x.key === 'h-f') < 0) {
      this.items.unshift(this.itemFactory.getHealthContainer('f'));
    }
    if (lvl > 10 && this.items.findIndex(x => x.key === 'h-m') < 0) {
      this.items.unshift(this.itemFactory.getHealthContainer('m'));
    }
    if (this.items.findIndex(x => x.key === 'h-s') < 0) {
      this.items.unshift(this.itemFactory.getHealthContainer('s'));
    }

    if (this.shopItems.length < 1) {
      for (var i = 0; i < 3; i++) {
        const nItem = this.itemFactory.generateWeapon(lvl || 1);
        this.items.push(nItem);
      }
    }

  }

  public close(): void {
    this.storeOpened = false;
    this.unsubcribable.forEach(u => u.unsubscribe());
    this.shopItems.length = 0;
    this.items.length = 0;
  }

  public purchase(itm: Item): void {
    if ((this.hero!.sack.items.length) >=
      (this.hero!.sack.limit)) {
      this.gameMec.sendGameMessage('Not enough space in bag');
      return;
    }

    const price = this.getPrice(itm);
    
    if (this.bank && this.bank.coin >= price) {
      this.bank.coin -= price;
      this.hero?.sack.items.push({ ...itm });
      this.gameMec.updatePlayer(this.hero!);
    }
  }

  ngOnDestroy(): void {
    this.close();
  }

  ionViewWillEnter() {

  }

  ionViewDidLeave() {
    this.close();
  }
}
