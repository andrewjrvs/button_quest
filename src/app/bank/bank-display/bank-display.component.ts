import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Bank } from '../../models';

@Component({
  selector: 'app-bank-display',
  templateUrl: './bank-display.component.html',
  styleUrls: ['./bank-display.component.scss']
})
export class BankDisplayComponent implements OnInit, OnChanges {
  @HostBinding('class.empty') public isEmpty = true;
  @HostBinding('class.broken') public notSet = true;

  @ViewChild(IonModal) modal!: IonModal;


  @Input()
  public bank?: Bank;

  @Input()
  public depositable = 0n;

  @Output()
  public withDrawCash = new EventEmitter<bigint>();

  @Output()
  public depositCash = new EventEmitter<bigint>();

  public isOpen = false;
  public changeAmount = 0;
  public maxAmt = 100;

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

  onWillDismiss(e: Event):void {
    this.isOpen = false;
  }

  addToBank(): void {
    this.changeAmount = Number(this.depositable);
    this.maxAmt = this.changeAmount;
    this.isOpen = true;
    this.msg = 'Deposit';
  }

  removeFromBank(): void {
    this.isOpen = true;
    this.changeAmount = Number(this.bank?.coin || 0)
    this.maxAmt = this.changeAmount;
    this.msg = 'Withdraw';
  }

  
  public confirm() {
    this.modal.dismiss(null, 'confirm');
    if (this.msg === 'Deposit') {
      this.depositCash.next(BigInt(this.changeAmount));
    } else {
      this.withDrawCash.next(BigInt(this.changeAmount));
    }
  }

  public cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
