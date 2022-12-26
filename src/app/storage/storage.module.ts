import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageDisplayComponent } from './storage-display/storage-display.component';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    StorageDisplayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IonicModule
  ]
  , exports: [StorageDisplayComponent]
})
export class StorgageModule { }
