export abstract class LabelIterator<T extends string | number>
  implements Iterator<T>
{
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
