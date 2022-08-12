export abstract class LabelIterator<T extends string | number> implements Iterator<T> {
  constructor(protected currentElement: T) {}

  next(): IteratorResult<T> {
    const oldElement = this.currentElement;
    this.currentElement = this.getNextElement();
    return {
      done: false,
      value: oldElement,
    };
  }

  protected abstract getNextElement(): T;
}

export class AlphabeticLabelIterator extends LabelIterator<string> {
  private currentNumberBase27 = '0'; // 1 because A is the initial currentElement, and A is 1

  constructor() {
    super('A');
  }

  protected getNextElement(): string {
    const nextNumberBase27 = (parseInt(this.currentNumberBase27, 26) + 1).toString(26);
    this.currentNumberBase27 = nextNumberBase27;
    return AlphabeticLabelIterator.base27ToString(nextNumberBase27);
  }

  public static base27ToString(value: string) {
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
}

export class NumericalLabelIterator extends LabelIterator<number> {

  constructor() {
    super(1);
  }

  protected getNextElement(): number {
    return this.currentElement + 1;
  }
}
