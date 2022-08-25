export class PeekingIterator<T> {
  private _iterator: Iterator<T>;
  private _nextVal: IteratorResult<T, any> | null;

  constructor(iterator: Iterator<T>) {
    this._iterator = iterator;
    this._nextVal = this._iterator.next();
  }

  peek() {
    return this._nextVal;
  }

  next() {
    //@ts-ignore
    let nextVal = structuredClone(this._nextVal);
    this._nextVal = this._iterator.next();
    return nextVal;
  }

  hasNext() {
    if (!this._nextVal) {
      return false;
    }
    return !this._nextVal.done;
  }
}
