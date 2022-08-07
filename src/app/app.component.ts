import { Component, NgZone, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { GameMecService } from './game-mec.service';
import { ItemFactoryService } from './item-factory.service';
import { Player } from './models/player';
import { User } from './models/user';
import { PlayerLibraryService } from './player-library.service';
import { findLevelFromExperience, getExpBaseForLevel } from './player-util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'button-quest';

  public user$: Observable<User> = this.gameMec.user$;

  constructor(private ngZone: NgZone
    , private menu: MenuController
    , private gameMec: GameMecService
    , private playerLibray: PlayerLibraryService
    , private itmSrv: ItemFactoryService) { }

  async ngOnInit() {
    // Network.addListener("networkStatusChange", (status) => {
    //   this.ngZone.run(() => {
    //     // This code will run in Angular's execution context
    //     this.networkStatus = status.connected ? "Online" : "Offline";
    //   });
    // });
    const plr = new Player(60, 1, [this.itmSrv.getNewWeapon(5)]);

    this.playerLibray.addPlayer(plr);
    // for (var i = 0; i < 99; i += 1) {
      
    //   console.log(`lvl ${i} expneeded ${getExpBaseForLevel(i)} `);
    // }
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
