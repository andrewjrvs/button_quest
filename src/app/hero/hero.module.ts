import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecPopupComponent } from './spec-popup/spec-popup.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    SpecPopupComponent
  ],
  imports: [
    CommonModule
    , IonicModule
  ],
  exports: [SpecPopupComponent]
})
export class HeroModule { }
