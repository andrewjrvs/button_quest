import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Bank } from '../../models';
import { Sack } from '../../models/sack';

@Component({
  selector: 'app-storage-display',
  templateUrl: './storage-display.component.html',
  styleUrls: ['./storage-display.component.scss']
})
export class StorageDisplayComponent implements OnInit, OnChanges {
  @HostBinding('class.empty') public isEmpty = true;
  @HostBinding('class.broken') public notSet = true;

  @ViewChild(IonModal) modal!: IonModal;


  @Input()
  public bank?: Bank;

  @Input()
  public sack?: Sack;

  public isStorageOpen = false;
  public storageState: 'wallet' | 'bank' = 'bank';

  public msg: 'Deposit' | 'Withdraw' = 'Withdraw';

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bank']) {
      this.notSet = !changes['bank'].currentValue;
      this.isEmpty = !changes['bank'].currentValue || changes['bank'].currentValue.coin < 1n;
      
    }

  }

  ngOnInit(): void {
  }

  onStorageWillDismiss(e: Event): void {
    this.isStorageOpen = false;
  }

  
  public confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  public cancel() {
    this.modal.dismiss(null, 'cancel');
  }
}
