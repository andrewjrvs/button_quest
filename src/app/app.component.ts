import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AppStoreService } from './app-store.service';
import { GameMecService } from './game-mechanics.service';
import { Player } from './models/hero';
import { User } from './models/user';
import { PlayerLibraryService } from './player-library.service';

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
    , private toastController: ToastController
    , private appStore: AppStoreService) {
    appStore.pullForFirstLoad().then((data) => {
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
