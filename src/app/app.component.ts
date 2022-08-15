import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AppStoreService } from './app-store.service';
import { GameMechanicsService } from './game-mechanics.service';
import { Bank, Hero, HeroType } from './models';
import { getExpBaseForLevel } from './utils/leveling-util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'button-quest';

  public user$: Observable<Bank | undefined> = this.gameMec.bank$;
  private unsubscribe: Subscription[] = [];


  constructor(private ngZone: NgZone
    , private menu: MenuController
    , private gameMec: GameMechanicsService
    , private toastController: ToastController
    , private appStore: AppStoreService) {

    
    // for (var i = 1; i < 200; i++) {
    //   console.log(`level ${i}`, getExpBaseForLevel(i));
    // }
    
    appStore.pullForFirstLoad().then((data) => {
      if (data) {
        const [bnk, plrlst, idx] = data;
        
        plrlst.forEach(plr => {
          // clean up the type...
          
          if (!Object.values(HeroType).includes(plr.type)) {
            plr.type = HeroType.KNIGHT;
          }
          this.gameMec.addHero(plr)
        });
        this.gameMec.setActiveIndex(idx || 0);
        this.gameMec.setBank(bnk);
      } else {
        // first load
        //this.itmSrv.getNewWeapon(5)
                
        const plr = new Hero('new', 'new', HeroType.KNIGHT, 'new', 80);
        plr.currentBreakpoint = getExpBaseForLevel(plr.level);
        plr.nextBreakpoint = getExpBaseForLevel(plr.level + 1);
        plr.property = {};
        plr.property['assignable'] = 5;
        this.gameMec.setBank(new Bank());
        this.gameMec.addHero(plr);
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
