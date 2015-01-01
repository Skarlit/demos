function PathFinder(grids, g, h) {

}

AStar = function(root, goal) {
  var heap = new Heap([root]);
  var visited = {};
  while (!heap.empty()) {
    var node = heap.pop();
    visited[node] = true;
    if( node == goal) {
      console.log(done);
    } else {
      for (var i = 0; i < node.children.length; i++) {
        if (!visited[node]) {
          heap.insert(node);
        }
      }
    }
  }
}

function dist(start, goal) {
  return start.previousNode.accumlateDist + start.weight + h(start, goal);
}

// arrayMap: two dimensional array of integers: 0 for space, 1 for wall.
function Map(arrayMap) {
  this.rowSize = arrayMap.length;
  this.colSize = arrayMap[0].length;
  this.map = new Array(this.rowSize);
  for (var i = 0; i < this.rowSize; i++) {
    this.map[i] = new Array(this.colSize);
    for(var j = 0; j < this.colSize; j++) {
      // set wall weight to infinity.
      this.map[i][j] = new Node(i, j, arrayMap[i][j] == 0 ? 1 : 1/0);
    }
  }
}

function Node(x, y, weight) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.accumlateDist = null;
  this.previousNode = null;
  this.weight = weight; 
}

// min binary heap
function Heap(obj, key) {
  this.heap = [null, obj];
  this.key = key;
}

Heap.prototype.insert = function(obj) {
  this.heap.push(obj);
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

Heap.prototype.print = function() {
  console.log(this.heap.map(function(el) { return el ? el[this.key] : null}.bind(this)));
}

window.onload = function() {
  var h = new Heap({val: 5}, 'val');
  h.insert({val: 6});
  h.print();
  h.insert({val: 3});
  h.print();
  h.pop();
  h.print();
}