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

  public getHealthPrice(itm: Item): bigint {
    return this.healthPrice[itm.subType === 's' ? 's' : itm.subType === 'm' ? 'm' : 'f'];
  }

  public unsubcribable: Subscription[] = [];

  constructor(private itemFactory: ItemFactoryService
    , private gameMec: GameMechanicsService) { }

  ngOnInit(): void {
    this.unsubcribable.push(
      this.gameMec.activeHero$
        .pipe(filter(p => !!p))
        .subscribe(p => {
          if (this.items.length < 1) {
            this.items.push(this.itemFactory.getHealthContainer('s'));
            if ((p?.level || 0) > 10) {
              this.items.push(this.itemFactory.getHealthContainer('m'));
            }
            if ((p?.level || 0) > 50) {
              this.items.push(this.itemFactory.getHealthContainer('f'));
            }
          } 
          this.activePlayer = p;
          if (this.shopItems.length < 1) {
            for (var i = 0; i < 3; i++) {
              const nItem = this.itemFactory.getNewWeapon(p?.level || 1);
              const price = ((nItem.improveAttack || 0) + (nItem.improveDefence || 0) || 1) * 1000;
              this.shopItems.push(
                [nItem, price]
              );
            }
          }
        })
      , this.gameMec.bank$.subscribe(b => this.bank = b)
    );
  }

  public purchase(itm: Attachable, cost: number) {
    // if (this.gameMec.getCoin() >= BigInt(cost)) {
    //   this.gameMec.addCoin(BigInt(0) - BigInt(cost));
    //   const nplr = { ...this.activePlayer } as Hero;
    //   nplr?.attachments.push(itm);
    //   this.plrLibsrv.updatePlayer(nplr);
    //   const idx = this.shopItems.findIndex(([im, cst]) => itm === im);
    //   this.shopItems.splice(idx, 1);
    // }
  }

  public purchaseHealth(itm: Item): void {
    if ((this.activePlayer!.sack.items.length) >= 
      (this.activePlayer!.sack.limit)) {
      this.gameMec.sendGameMessage('Not enough space in bag');
      return;
    }

    if (itm.type === ItemType.HEALTH) {
      let price = this.healthPrice['s'];
      switch (itm.subType) {
        case 'm':
          price = this.healthPrice['m'];
          break;
        case 'f':
          price = this.healthPrice['f'];
      }
      console.log('trying to buy', this.bank, price);
      if (this.bank && this.bank.coin >= price) {
        this.bank.coin -= price;
        this.activePlayer?.sack.items.push(itm);
        this.gameMec.updatePlayer(this.activePlayer!);      
      }

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
  }
}
