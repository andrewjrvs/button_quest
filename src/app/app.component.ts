import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { AppStoreService } from './app-store.service';
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
export class AppComponent implements OnInit, OnDestroy {
  title = 'button-quest';

  public user$: Observable<User> = this.gameMec.user$;
  private unsubscribe: Subscription[] = [];


  constructor(private ngZone: NgZone
    , private menu: MenuController
    , private gameMec: GameMecService
    , private playerLibray: PlayerLibraryService
    , private itmSrv: ItemFactoryService
    , private toastController: ToastController
    , private appStore: AppStoreService) {
    appStore.pullForFirstLoad().then((data) => {
      console.log('data loaded', data);
      if (data) {
        const [usr, plrlst, idx] = data;
        plrlst.forEach(plr => this.playerLibray.addPlayer(plr));
        this.playerLibray.setActivePlayer(idx || 0);
        this.gameMec.addCoin(usr.coin);
      } else {
        // first load
        //this.itmSrv.getNewWeapon(5)
        const plr = new Player(60, 1, []);

        this.playerLibray.addPlayer(plr);
      }
     

    })
  }
  
  ngOnDestroy(): void {
    this.unsubscribe.forEach(fn => fn.unsubscribe());
  }

  async ngOnInit() {
    // Network.addListener("networkStatusChange", (status) => {
    //   this.ngZone.run(() => {
    //     // This code will run in Angular's execution context
    //     this.networkStatus = status.connected ? "Online" : "Offline";
    //   });
    // });
    
    // for (var i = 0; i < 99; i += 1) {
      
    //   console.log(`lvl ${i} expneeded ${getExpBaseForLevel(i)} `);
    // }

    this.unsubscribe.push(
      this.gameMec.gameMessage$.subscribe(([msg, icon, header]) => {
        this.toastController.create({
          // header: 'Note:',
          message: msg,
          duration: 2000,
          icon: icon || 'information-circle',
          position: 'bottom'
        }).then(obj => obj.present());
      })
    );
  }
}
