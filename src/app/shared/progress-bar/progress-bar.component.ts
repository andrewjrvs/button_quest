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
  public min?: bigint | number = 0n;

  @Input()
  public max?: bigint | number = 100n;

  @Input()
  public value: bigint | number | null = null;

  public getCalcWidth() {
    const relVal = (BigInt(this.value || 0n)) - (BigInt(this.min || 0n));
    if (relVal < 1) {
      return 0;
    }
    return BigInt(relVal * 100n / ((BigInt(this.max || 100n)) - (BigInt(this.min || 0n))));
  }

  constructor() { }

  ngOnInit(): void {
  }

}
