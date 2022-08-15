import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Hero } from '../../models';

@Component({
  selector: 'app-spec-popup',
  templateUrl: './spec-popup.component.html',
  styleUrls: ['./spec-popup.component.scss']
})
export class SpecPopupComponent implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  @Input()
  public hero!: Hero;

  @Input()
  public isOpen: boolean = false;

  @Output()
  public dismissed = new EventEmitter<any>();

  public activeTab: string = 'sack';

  constructor() { }

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
