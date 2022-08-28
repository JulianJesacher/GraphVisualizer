import { Node } from 'vis';
import { PriorityQueue } from './priorityQueue';

const compareNodePriority = (nodeA: NodeWithPriority, nodeB: NodeWithPriority): number => nodeA.priority - nodeB.priority;
const equalNodePriorityId = (nodeA: NodeWithPriority, nodeB: NodeWithPriority): boolean => nodeA.id === nodeB.id;
const getNodePriority = (node: NodeWithPriority): number => node.priority;
const setNodePriority = (node: NodeWithPriority, newPriority: number): NodeWithPriority => {
  node.priority = newPriority;
  return node;
};
const initializeNodeWithPriority = (node: Node, priority: number = 0): NodeWithPriority => {
  return { ...node, priority };
};

interface NodeWithPriority extends Node {
  priority: number;
}

export class NodePriorityQueue {
  private _priorityQueue: PriorityQueue<NodeWithPriority>;
  constructor() {
    this._priorityQueue = new PriorityQueue<NodeWithPriority>(compareNodePriority, equalNodePriorityId, getNodePriority, setNodePriority);
  }

  size(): number {
    return this._priorityQueue.size();
  }

  isEmpty(): boolean {
    return this._priorityQueue.isEmpty();
  }

  getMin(): Node {
    return this._priorityQueue.getMin() as Node;
  }

  deleteMin(): Node {
    return this._priorityQueue.deleteMin() as Node;
  }

  insert(node: Node, priority: number): void {
    this._priorityQueue.insert(initializeNodeWithPriority(node, priority));
  }

  decreaseKey(node: Node, newKey: number): void {
    this._priorityQueue.decreaseKey(node as NodeWithPriority, newKey);
  }
}
