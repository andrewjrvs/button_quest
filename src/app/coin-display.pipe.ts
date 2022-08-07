import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coinDisplay'
})
export class CoinDisplayPipe implements PipeTransform {

  private div(value: number | BigInt, by: number) {
    if (typeof value === "bigint") {
      return value / BigInt(by);
    }
    return Math.floor(<any>value / by);
  }

  transform(value: number | BigInt | null, ...args: unknown[]): string {
    if (!value) {
      return '0';
    }
    
    if (value >= 1000000000000) {
      return `A LOT!`;
    } else if (value >= 1000000000) {
      return `${this.div(value, 1000000000)}B`;
    } else if (value >= 1000000) {
      return `${this.div(value, 1000000)}M`;
    } else if (value >= 1000) {
      return `${this.div(value, 1000)}k`;
    }
    return `${value}`;
  }

}
