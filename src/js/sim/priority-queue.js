/**
 * Priority queue. Supports insert and delete-the-minimum (poll) operations.
 * This implementation uses a binary heap.
 * The insert and poll operations take logarithmic amortized time.
 * The min, size, and is-empty operations take constant time.
 */
export default class PriorityQueue {

    constructor() {
        // number of elements in heap
        this.n = 0;
        // binary heap
        // parent of the node in position k is in position floor(k/2)
        // children of the node in position k are in positions 2k and 2k+1
        // root of the heap is [1], [0] is unused
        this.queue = [];
    }

    /**
     * Insert event into priority queue.
     * @param event simulation event
     */
    insert(event) {
        // increment heap size
        this.n++;
        // add new node at the bottom of the heap
        this.queue[this.n] = event;
        // reheapify
        this._swim(this.n);
    }

    /**
     * Restore heap order when node's key becomes larger than its parent key.
     * @param k node index
     * @private
     */
    _swim(k) {
        // k >> 1 is essentially a floor(k/2)
        // if parent's key is greater than node's key, swap node and parent and move up
        while (k > 1 && this._greater(k >> 1, k)) {
            let parentIndex = k >> 1;
            this._swap(k, parentIndex);
            k = parentIndex;
        }
    }

    _greater(i, j) {
        return this.queue[i].compareTo(this.queue[j]) > 0;
    }

    _swap(i, j) {
        let swap = this.queue[i];
        this.queue[i] = this.queue[j];
        this.queue[j] = swap;
    }

    /**
     * @return {*} element with minimum priority
     * @throws {Error} when this priority queue is empty
     */
    poll() {
        if (this.isEmpty()) {
            throw new Error('Priority queue is empty');
        }
        let min = this.queue[1];
        // swap root node and bottom node
        this._swap(1, this.n);
        // decrement heap size
        this.n--;
        // reheapify
        this._sink(1);
        // delete last element in the array
        this.queue.length = this.n + 1;
        return min;
    }

    /**
     * Restore heap order when node’s key becomes smaller than one or both of that node’s children’s keys.
     * @param k node index
     * @private
     */
    _sink(k) {
        while (2 * k <= this.n) {
            let childIndex = 2 * k;
            // pick child node with smaller key
            if (childIndex < this.n && this._greater(childIndex, childIndex + 1)) {
                childIndex++;
            }
            if (!this._greater(k, childIndex)) {
                // the parent key is not greater than the child's key: heap order restored
                break;
            }
            // swap parent node with the smallest child node
            this._swap(k, childIndex);
            // move down the heap
            k = childIndex;
        }
    }

    /**
     * @return {boolean} this priority queue is empty
     */
    isEmpty() {
        return this.n === 0;
    }

    clear() {
        this.n = 0;
        this.queue.length = 0;
    }
}