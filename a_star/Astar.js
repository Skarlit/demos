function PathFinder(mazeDom) {
  this.gridMap = new Map(mazeDom);
}

PathFinder.prototype.heuristic = function(node) {
  return Math.abs(node.i - this.goalNode.i) + Math.abs(node.j - this.goalNode.j);
}

PathFinder.prototype.AStarSearch = function(mazeDom) {
  var startGrid = mazeDom.getElementsByClassName('start')[0];
  var goalGrid = mazeDom.getElementsByClassName('goal')[0];
  this.goalNode = this.gridMap._get(goalGrid.dataset.i, goalGrid.dataset.j);
  this.startNode = this.gridMap._get(startGrid.dataset.i, startGrid.dataset.j);
  this.startNode.g_score = 0;
  this.startNode.f_score = this.startNode.g_score + this.heuristic(this.startNode);
  var heap = new Heap(this.startNode, 'f_score');
  while (!heap.empty()) {
    var current = heap.pop();
    if(current.eq(this.goalNode)) {
      // backtrace and print route
      var parent = current.previousNode;
      while (!parent.eq(this.startNode)) {
        parent.print();
        document.getElementById(parent.i + '-' + parent.j).classList.add('path');
        parent = parent.previousNode;
      }
      return;
    } 
    current.visited = true;
    current.print();
    var neighbors = this.gridMap.adjacentTo(current.i, current.j, function(node) { 
      return node.type == 'space' }
    )
    for (var i = 0; i < neighbors.length; i++) {
      if (neighbors[i].visited) { continue; }
      tentative_g_score = current.g_score + neighbors[i].weight;
      if(!heap.has(neighbors[i]) || tentative_g_score < neighbors[i].g_score) {
        neighbors[i].previousNode = current;
        neighbors[i].g_score = tentative_g_score;
        neighbors[i].f_score = neighbors[i].g_score + this.heuristic(neighbors[i]);
        if(!heap.has(neighbors[i])) {
          heap.insert(neighbors[i]);
        }
      } 
    }
  }
}

// window.onload = function() {
//   var h = new Heap({val: 5}, 'val');
//   for(var i = 0; i < 10; i ++) {
//     h.insert({val: 10 - i}, 'val');
//     h.print();
//   }
// }