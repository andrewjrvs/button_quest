import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecPopupComponent } from './spec-popup/spec-popup.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SpecPopupComponent
  ],
  imports: [
    CommonModule
    , IonicModule
    , SharedModule
  ],
  exports: [SpecPopupComponent]
})
export class HeroModule { }
