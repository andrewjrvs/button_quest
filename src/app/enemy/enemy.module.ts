import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnemyComponent } from './enemy.component';
import { DisplayIconComponent } from './display-icon.component';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { EnemyDetailComponent } from './spec-popup/enemy-detail.component';
import { SpecPopupComponent } from './spec-popup/spec-popup.component';



@NgModule({
  declarations: [
    EnemyComponent,
    DisplayIconComponent,
    EnemyDetailComponent,
    SpecPopupComponent
  ],
  imports: [
    CommonModule
    , SharedModule
    , IonicModule
  ],
  exports: [
    EnemyComponent
  ]
})
export class EnemyModule { }
