// arrayMap: two dimensional array of integers: 0 for space, 1 for wall.
function Map(mazeDom) {
  this._parseDom(mazeDom);
}

Map.prototype._parseDom = function(mazeDom) {
  var rows = mazeDom.getElementsByTagName('tr');
  var cells = mazeDom.getElementsByTagName('td');
  this.rowSize = rows.length;
  this.colSize = rows[0].children.length;
  this.map = new Array(this.rowSize);
  for (var i = 0; i < this.rowSize; i++) {
    this.map[i] = new Array(this.colSize);
  }
  for (var k = 0; k < cells.length; k++) {
    var i = parseInt(cells[k].dataset.i);
    var j = parseInt(cells[k].dataset.j);
    if (cells[k].classList.contains('wall')) {
      this.map[i][j] = new Node(i, j, 1/0, 'wall');
    } else {
      this.map[i][j] = new Node(i, j, 1, 'space');
    }
  }
};

Map.prototype._get = function(i, j) {
  return this.map[i][j];
};

Map.prototype.adjacentTo = function(i, j, filter) {
  var neighbors = [];
  this.map[i][j + 1] && filter(this.map[i][j + 1]) ? neighbors.push(this.map[i][j + 1]) : null;
  this.map[i][j - 1] && filter(this.map[i][j - 1]) ? neighbors.push(this.map[i][j - 1]) : null;
  if (this.map[i + 1]) {
    //this.map[i + 1][j + 1] && filter(this.map[i + 1][j + 1]) ? neighbors.push(this.map[i + 1][j + 1]) : null;
    this.map[i + 1][j] && filter(this.map[i + 1][j]) ? neighbors.push(this.map[i + 1][j]) : null;
    //this.map[i + 1][j - 1] && filter(this.map[i + 1][j - 1]) ? neighbors.push(this.map[i + 1][j - 1]) : null;
  }
  if (this.map[i - 1]) {
   // this.map[i - 1][j + 1] && filter(this.map[i - 1][j + 1]) ? neighbors.push(this.map[i - 1][j + 1]) : null;
    this.map[i - 1][j] && filter(this.map[i - 1][j]) ? neighbors.push(this.map[i - 1][j]) : null;
    //this.map[i - 1][j - 1] && filter(this.map[j - 1][j - 1]) ? neighbors.push(this.map[i - 1][j - 1]) : null;
  }
  return neighbors;
};

// nodes for Map class.
function Node(i, j, weight, type) {
  this.i = i;
  this.j = j;
  this.visited = false;
  this.g_score = null;
  this.f_score = null;
  this.previousNode = null;
  this.weight = weight;
  this.type = type; 
}

Node.prototype.eq = function(operand) {
  return this.i == operand.i && this.j == operand.j
};

Node.prototype.print = function() {
  console.log('(' + this.i + ', ' + this.j + ')');
};