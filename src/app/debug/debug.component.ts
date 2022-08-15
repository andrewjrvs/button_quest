import { Component, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { GameMechanicsService } from '../game-mechanics.service';
import { Villan, Hero, Bank } from '../models';
import { jsonStringify } from '../utils/system-util';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  private unsubscribe: Subscription[] = [];
  public playerList?: Hero[];
  public jsonOfiablePlayerList?: any;
  public enemy?: Villan;
  public JSONOfiableVillan: any;

  public bank?: Bank;
  public JSONOfiableBank: any;

  constructor(private gameMec: GameMechanicsService) { }

  ngOnInit(): void {
  }

  ionViewDidLeave() {
    this.unsubscribe.forEach(fn => fn.unsubscribe()); 
    // this.activePlayer = undefined;
  }

  ionViewWillEnter() {
    this.unsubscribe.push(
      this.gameMec.heroList$.subscribe(l => {
        this.playerList = l
        this.jsonOfiablePlayerList = JSON.parse(jsonStringify(l));
      }),
      this.gameMec.activeVillan$.pipe(
        filter(e => !!e)
      ).subscribe(e => {
        this.enemy = e;
        this.JSONOfiableVillan = JSON.parse(jsonStringify(e));
      }),
      this.gameMec.bank$.pipe(
        filter(b => !!b)
      ).subscribe(b => {
        this.bank = b;
        this.JSONOfiableBank = JSON.parse(jsonStringify(b));
      })
    );
  }

}
