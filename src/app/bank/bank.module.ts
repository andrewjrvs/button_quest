import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDisplayComponent } from './bank-display/bank-display.component';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    BankDisplayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IonicModule
  ]
  , exports: [BankDisplayComponent]
})
export class BankModule { }
