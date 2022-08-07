import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugComponent } from './debug/debug.component';
import { ButtonsComponent } from './pages/buttons.component';
import { LandingComponent } from './pages/landing.component';
import { TownComponent } from './pages/town.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent }
  , { path: 'buttons', component: ButtonsComponent }
  , { path: 'town', component: TownComponent }
  , { path: 'debug', component: DebugComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
