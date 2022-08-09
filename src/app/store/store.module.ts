import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { StoreService } from './store.service';
import { ItemFactoryService } from './item-factory.service';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [
    StoreService
    , ItemFactoryService
  ],
  exports: [StoreComponent]
})
export class StoreModule { }
