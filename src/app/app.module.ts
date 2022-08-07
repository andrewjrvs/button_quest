import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { LandingComponent } from './pages/landing.component';
import { ButtonsComponent } from './pages/buttons.component';
import { PlayerLibraryService } from './player-library.service';
import { EnemyFactoryService } from './enemy-factory.service';
import { TownComponent } from './pages/town.component';
import { ItemFactoryService } from './item-factory.service';
import { EnemyComponent } from './parts/enemy.component';
import { PlayerComponent } from './parts/player.component';
import { PlayerHealthComponent } from './parts/player-health.component';
import { CoinDisplayPipe } from './coin-display.pipe';
import { GameMecService } from './game-mec.service';

@NgModule({
  declarations: [
    AppComponent,
    ProgressBarComponent,
    LandingComponent,
    ButtonsComponent,
    TownComponent,
    EnemyComponent,
    PlayerComponent,
    PlayerHealthComponent,
    CoinDisplayPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    IonicModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    , PlayerLibraryService
    , EnemyFactoryService
    , ItemFactoryService
    , GameMecService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
