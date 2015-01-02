function PathFinder(mazeDom, g, h) {
  var grids = this._parseDom(mazeDom);
  this.gridMap = new Map(grids);
}

PathFinder.prototype.AStarSearch = function(root, goal) {
  var heap = new Heap(root, 'accumlateDist');
  while (!heap.empty()) {
    var node = Heap.pop();
    node.visited = true;
    if(node.eq(goal)) {
      // backtrace and print route
      var parent = node.previousNode;
      while (!parent.eq(root)) {
        parent.print();
        parent = parent.previousNode;
      }
      parent.print();
    } else {
      var neighbors = this.gridMap.adjacentTo(node.i, node.j, function(node) { return node.weight == 0 })
      for (var i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].visited) {
          heap.insert(neighbors[i]);
        }
      }
    }
  }
}

PathFinder.prototype._parseDom = function(mazeDom) {
  
};

function dist(start, goal) {
  return start.previousNode.accumlateDist + start.weight + Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
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

Map.prototype._get = function(i, j) {
  return this.map[i][j];
};

Map.prototype.adjacentTo = function(i, j, filter) {
  var neighbors = [];
  if (j > 0) {
    i > 0 && filter(this._get(i - 1, j - 1)) ? neighbors.push(this._get(i - 1, j - 1)) : null;
    filter(this._get(i, j - 1)) ? neighbors.push(this._get(i, j - 1)) : null;
    i + 1 < this.rowSize && filter(this._get(i + 1, j - 1)) ? neighbors.push(this._get(i + 1, j - 1)) : null;
  }
  if (j > 0) {
    i > 0 && filter(this._get(i - 1, j + 1)) ? neighbors.push(this._get(i - 1, j + 1)) : null;
    filter(this._get(i, j + 1)) ? neighbors.push(this._get(i, j + 1)) : null;
    i + 1 < this.rowSize && filter(this._get(i + 1, j + 1)) ? neighbors.push(this._get(i + 1, j + 1)) : null;
  }
  i + 1 < this.rowSize && filter(this._get(i + 1, j)) ? neighbors.push(this._get(i + 1, j)) : null;
  i > 0 && filter(this._get(i - 1, j)) ? neighbors.push(this._get(i - 1, j)) : null;
};

// nodes for Map class.
function Node(x, y, weight) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.accumlateDist = null;
  this.previousNode = null;
  this.weight = weight; 
}

Node.prototype.eq = function(operand) {
  return this.x == operand.x && this.y == operand.y
};

Node.prototype.print = function() {
  console.log('(' + print.x + ', ' + print.y + ')');
};

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

Heap.prototype.empty = function() {
  return this.heap.length == 1;
};

window.onload = function() {
  var h = new Heap({val: 5}, 'val');
  for(var i = 0; i < 10; i ++) {
    h.insert({val: 10 - i}, 'val');
    h.print();
  }
}