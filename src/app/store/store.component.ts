import { Component, OnInit } from '@angular/core';
import { Attachable } from '../models/attachable';
import { PlayerLibraryService } from '../player-library.service';
import { ItemFactoryService } from './item-factory.service';
import { filter, take } from 'rxjs/operators';
import { Player } from '../models/hero';
import { Subscription } from 'rxjs';
import { GameMecService } from '../game-mechanics.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  public shopItems: [Attachable, number][] = [];
  public activePlayer?: Player;

  public unsubcribable: Subscription[] = [];

  constructor(private itemFactory: ItemFactoryService
    , private plrLibsrv: PlayerLibraryService
  , private gameMec: GameMecService) { }

  ngOnInit(): void {
    this.unsubcribable.push(
      this.plrLibsrv.activePlayer$
        .pipe(filter(p => !!p))
        .subscribe(p => {
          this.activePlayer = p
          console.log('actplr');
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
    )
  }

  public purchase(itm: Attachable, cost: number) {
    if (this.gameMec.getCoin() >= BigInt(cost)) {
      this.gameMec.addCoin(BigInt(0) - BigInt(cost));
      const nplr = { ...this.activePlayer } as Player;
      nplr?.attachments.push(itm);
      this.plrLibsrv.updatePlayer(nplr);
      const idx = this.shopItems.findIndex(([im, cst]) => itm === im);
      this.shopItems.splice(idx, 1);
    }
  }

  ngOnDestroy(): void {
    this.unsubcribable.forEach(u => u.unsubscribe());
    this.shopItems.length = 0;
  }

  ionViewWillEnter() { 
    console.log('ionviewwillenter');
    
    
  }

  ionViewDidLeave() {

  }
}
