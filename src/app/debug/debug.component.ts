import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Player } from '../models/player';
import { PlayerLibraryService } from '../player-library.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  private unsubscribe: Subscription[] = [];
  public playerList?: Player[];
  public jsonOfiablePlayerList?: any;

  constructor(private plyLibSrv: PlayerLibraryService) { }

  ngOnInit(): void {
  }

  ionViewDidLeave() {
    this.unsubscribe.forEach(fn => fn.unsubscribe()); 
    // this.activePlayer = undefined;
  }

  ionViewWillEnter() {
    this.unsubscribe.push(
      this.plyLibSrv.list$.subscribe(l => {
        this.playerList = l
        this.jsonOfiablePlayerList = JSON.parse(JSON.stringify(l, (_, value) => typeof value === 'bigint'
        ? "<bigint>:" + value.toString()
        : value))
      })
    );
  }

}
