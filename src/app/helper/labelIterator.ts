export abstract class LabelIterator<T> implements Iterator<T> {
  protected currentValue = this.initialValue();

  next(): IteratorResult<T> {
    const oldElement = this.currentValue;
    this.currentValue = this.getNextValue(this.currentValue);
    return {
      done: false,
      value: oldElement,
    };
  }

  reset():void{
    this.currentValue = this.initialValue();
  }

  protected abstract initialValue(): T;
  protected abstract getNextValue(previousValue: T): T;
}

export class AlphabeticLabelIterator extends LabelIterator<string> {
  private currentNumberBase27 = '0'; // 1 because A is the initial currentElement, and A is 1

  protected initialValue() { return 'A'; }

  protected getNextValue(_: string): string {
    const nextNumberBase27 = (parseInt(this.currentNumberBase27, 26) + 1).toString(26);
    this.currentNumberBase27 = nextNumberBase27;
    return AlphabeticLabelIterator.base26ToString(nextNumberBase27);
  }

  public static base26ToString(value: string) {
    const chars = value.split('');
    return chars
      .map((digit, index) => {
        if (index === chars.length - 1) {
          return String.fromCharCode(65 + parseInt(digit, 26));
        }
        return String.fromCharCode(64 + parseInt(digit, 26)); // Allow to show A... and not skip the A and start with B...
      })
      .join('');
  }

  override reset(): void {
    this.currentValue = this.initialValue();
    this.currentNumberBase27 = '0'
  }
}

export class NumericalLabelIterator extends LabelIterator<number> {

  protected initialValue() {
    return 0;
  }

  protected getNextValue(currentValue: number): number {
    return currentValue + 1;
  }
}
