import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameMechanicsService } from '../game-mechanics.service';
import { Bank } from '../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public bank$: Observable<Bank | undefined> = this.gameMec.bank$;
  public hero$ = this.gameMec.activeHero$;
  public heroSpecs = false;

  constructor(private gameMec: GameMechanicsService) { }

  ngOnInit(): void {
  }

  public openSpecs(): void {
    this.heroSpecs = true;

  }

  public specDismissed(): void {
    this.heroSpecs = false;
  }

}
