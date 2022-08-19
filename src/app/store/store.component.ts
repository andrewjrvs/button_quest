import { Component, OnInit } from '@angular/core';
import { Attachable } from '../models/attachable';
import { ItemFactoryService } from './item-factory.service';
import { filter, take } from 'rxjs/operators';
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
  public activePlayer?: Hero;
  public bank?: Bank;

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

    this.items.push(this.itemFactory.generateImproveItem());

    this.unsubcribable.push(
      this.gameMec.activeHero$
        .pipe(filter(p => !!p))
        .subscribe(p => {

          if ((p?.level || 0) > 50 && this.items.findIndex(x => x.key === 'h-f') < 0) {
            this.items.unshift(this.itemFactory.getHealthContainer('f'));
          }
          if ((p?.level || 0) > 10 && this.items.findIndex(x => x.key === 'h-m') < 0) {
            this.items.unshift(this.itemFactory.getHealthContainer('m'));
          }
          if (this.items.findIndex(x => x.key === 'h-s') < 0) {
            this.items.unshift(this.itemFactory.getHealthContainer('s'));
          }

          this.activePlayer = p;
          if (this.shopItems.length < 1) {
            for (var i = 0; i < 3; i++) {
              const nItem = this.itemFactory.generateWeapon(p?.level || 1);
              this.items.push(nItem);
              // const price = ((nItem.improveAttack || 0) + (nItem.improveDefence || 0) || 1) * 1000;
              // this.shopItems.push(
              //   [nItem, price]
              // );
            }
          }
        })
      , this.gameMec.bank$.subscribe(b => this.bank = b)
    );
  }


  public purchase(itm: Item): void {
    if ((this.activePlayer!.sack.items.length) >=
      (this.activePlayer!.sack.limit)) {
      this.gameMec.sendGameMessage('Not enough space in bag');
      return;
    }

    const price = this.getPrice(itm);
    
    if (this.bank && this.bank.coin >= price) {
      this.bank.coin -= price;
      this.activePlayer?.sack.items.push({ ...itm });
      this.gameMec.updatePlayer(this.activePlayer!);
    }
  }

  ngOnDestroy(): void {
    console.log('store destory')
    this.unsubcribable.forEach(u => u.unsubscribe());
    this.shopItems.length = 0;
  }

  ionViewWillEnter() {
    console.log('ionviewwillenter');


  }

  ionViewDidLeave() {
    console.log('ionviewdidleave');
    
    this.unsubcribable.forEach(u => u.unsubscribe());
  }
}
