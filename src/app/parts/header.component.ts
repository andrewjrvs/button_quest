import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameMecService } from '../game-mechanics.service';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public user$: Observable<User> = this.gameMec.user$;


  constructor(private gameMec: GameMecService) { }

  ngOnInit(): void {
  }

}
