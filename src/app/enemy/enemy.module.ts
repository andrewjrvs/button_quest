import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnemyComponent } from './enemy.component';
import { DisplayIconComponent } from './display-icon.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    EnemyComponent,
    DisplayIconComponent
  ],
  imports: [
    CommonModule
    , SharedModule
  ],
  exports: [
    EnemyComponent
  ]
})
export class EnemyModule { }
