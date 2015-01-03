// min binary heap
function Heap(obj, key) {
  this.heap = [null, obj];
  this.key = key;
  this.registry = new Set();
  this.registry.add(obj);
}

Heap.prototype.insert = function(obj) {
  this.heap.push(obj);
  this.registry.add(obj);
  var objIndex = this.heap.length - 1;
  while(objIndex > 1) {
    var parentIndex = parseInt(objIndex / 2);
    if (this.heap[objIndex][this.key] < this.heap[parentIndex][this.key]) {
      var temp = this.heap[parentIndex];
      this.heap[parentIndex] = this.heap[objIndex];
      this.heap[objIndex] = temp;
      // update objIndex
      objIndex = parseInt(objIndex / 2); 
    } else {
      return;
    }
  }
};

Heap.prototype.pop = function() {
  var min = this.heap[1];
  this.registry.delete(min);
  var bubbleIndex = 1;
  while (1) {
    var leftChildIndex = 2 * bubbleIndex;
    var rightChildIndex = 2 * bubbleIndex + 1;
    // no more child.
    if (!this.heap[leftChildIndex]) {
      if (bubbleIndex < this.heap.length - 1) {
        // pop the array to fill in the bubble.
        this.heap[bubbleIndex] = this.heap.pop();
        return min;
      } else {
        // bubble at the end of array, pop the last entry.
        this.heap.pop();
        return min;
      }
    }
    if (!this.heap[rightChildIndex] || this.heap[leftChildIndex][this.key] < this.heap[rightChildIndex][this.key]) {
      this.heap[bubbleIndex] = this.heap[leftChildIndex];
      bubbleIndex = leftChildIndex;
    } else {
      this.heap[bubbleIndex] = this.heap[rightChildIndex];
      bubbleIndex = rightChildIndex;
    }
  }
};

Heap.prototype.has = function(obj) {
  return this.registry.has(obj);
};

Heap.prototype.print = function() {
  console.log(this.heap.map(function(el) { return el ? el[this.key] : null}.bind(this)));
}

Heap.prototype.empty = function() {
  return this.heap.length == 1;
};
