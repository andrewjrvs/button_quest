import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { HeroIconComponent } from './hero-icon/hero-icon.component';
import { ItemIconComponent } from './item-icon/item-icon.component'
import { CoinIconComponent } from './coin-icon/coin-icon.component';


@NgModule({
  declarations: [ProgressBarComponent, HeroIconComponent, ItemIconComponent, CoinIconComponent],
  imports: [
    CommonModule
  ],
  exports: [ProgressBarComponent, HeroIconComponent, ItemIconComponent, CoinIconComponent]
})
export class SharedModule { }
