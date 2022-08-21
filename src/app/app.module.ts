import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { LandingComponent } from './pages/landing.component';
import { ButtonsComponent } from './pages/buttons.component';
import { VillanFactoryService } from './villan-factory.service';
import { TownComponent } from './pages/town.component';
import { PlayerComponent } from './parts/player.component';
import { PlayerHealthComponent } from './parts/player-health.component';
import { CoinDisplayPipe } from './coin-display.pipe';
import { GameMechanicsService } from './game-mechanics.service';
import { AppStoreService } from './app-store.service';
import { DebugComponent } from './debug/debug.component';
import { StoreModule } from './store/store.module';
import { HeaderComponent } from './parts/header.component';
import { EnemyModule } from './enemy/enemy.module';
import { SharedModule } from './shared/shared.module';
import { HeroModule } from './hero/hero.module';
import { BankModule } from './bank/bank.module';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ButtonsComponent,
    TownComponent,
    PlayerComponent,
    PlayerHealthComponent,
    CoinDisplayPipe,
    DebugComponent,
    HeaderComponent,

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
    IonicModule.forRoot(),
    StoreModule,
    EnemyModule,
    SharedModule,
    HeroModule,
    BankModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    , GameMechanicsService
    , VillanFactoryService
    , AppStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
