import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Villan } from '../../models';
import { Sack } from '../../models/sack';

@Component({
  selector: 'app-spec-popup',
  templateUrl: './spec-popup.component.html',
  styleUrls: ['./spec-popup.component.scss']
})
export class SpecPopupComponent implements OnInit, OnChanges {

  @ViewChild(IonModal) modal!: IonModal;

  @Input()
  public enemy!: Villan;

  @Input()
  public isOpen: boolean = false;

  public sack?: Sack;

  @Output()
  public dismissed = new EventEmitter<any>();

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enemy']) {
      this.sack = (changes['enemy'].currentValue as Villan)?.sack;
    }
  }

  ngOnInit(): void {
  }

  public confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  public cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  public onWillDismiss(e: Event): void {
    this.dismissed.next(null);
  }



}
