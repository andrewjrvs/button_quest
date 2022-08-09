import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ProgressBarComponent implements OnInit {
  @HostBinding('class.progress') private clss = true;

  @Input()
  public min: number = 0;

  @Input()
  public max: number = 100;

  @Input()
  public value: number | null = null;

  public getCalcWidth() {
    const relVal = (this.value || 0) - this.min;
    if (relVal < 1) {
      return 0;
    }
    return Math.ceil(relVal * 100 / (this.max - this.min));
  }

  constructor() { }

  ngOnInit(): void {
  }

}
