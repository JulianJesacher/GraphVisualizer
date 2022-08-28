const left = (parentIndex: number): number => (parentIndex << 1) + 1;
const right = (parentIndex: number): number => (parentIndex + 1) << 1;
const parent = (childIndex: number): number => ((childIndex + 1) >>> 1) - 1;

export class PriorityQueue<T> {
  private _heap: T[];

  constructor(
    private comparePriorities: (a: T, b: T) => number,
    private equalElements: (a: T, b: T) => boolean,
    private getKey: (element: T) => number,
    private setKey: (element: T, newKey: number) => void,
    ...values: T[]
  ) {
    this._heap = [];
    this._build(values);
  }

  size(): number {
    return this._heap.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  getMin(): T {
    if (this.isEmpty()) {
      throw new Error('The priority queue is empty!');
    }
    return this._heap[0];
  }

  deleteMin(): T {
    const currentMin = this.getMin();
    this._swap(0, this.size() - 1);
    this._siftDown(0);
    return currentMin;
  }

  insert(...values: T[]): void {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp(this.size() - 1);
    });
  }

  decreaseKey(node: T, newKey: number): void {
    const currentKey = this.getKey(node);
    if (newKey > currentKey) {
      throw new Error('New key can not be greate than current key!');
    }

    const elementIndex = this._heap.findIndex((currentElement) => this.equalElements(currentElement, node));
    this.setKey(node, newKey);
    this._siftUp(elementIndex);
  }

  private _build(values: T[]): void {
    this._heap = values;
    for (let i = (this.size() << 1) - 1; i >= 0; i--) {
      this._siftDown(i);
    }
  }

  private _siftDown(node: number): void {
    while (
      (left(node) < this.size() && this._smaller(left(node), node)) ||
      (right(node) < this.size() && this._smaller(right(node), node))
    ) {
      let minChild = right(node) < this.size() && this._smaller(right(node), left(node)) ? right(node) : left(node);
      this._swap(node, minChild);
      node = minChild;
    }
  }

  private _siftUp(node: number): void {
    while (node !== 0 && this._greater(parent(node), node)) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }

  private _smaller(index1: number, index2: number): boolean {
    return this.comparePriorities(this._heap[index1], this._heap[index2]) < 0;
  }

  private _greater(index1: number, index2: number): boolean {
    return this.comparePriorities(this._heap[index1], this._heap[index2]) > 0;
  }

  private _swap(index1: number, index2: number): void {
    [this._heap[index1], this._heap[index2]] = [this._heap[index2], this._heap[index1]];
  }
}
