import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { StoreService } from './store.service';
import { ItemFactoryService } from './item-factory.service';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule
  ],
  providers: [
    StoreService
    , ItemFactoryService
  ],
  exports: [StoreComponent]
})
export class StoreModule { }
