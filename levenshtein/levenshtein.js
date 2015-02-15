var EditDist = (function() {

  function Levenshtein(word1, word2) {
    var matrix = new DistanceMatrix(word1, word2, new LookUpTable());
    matrix.levenshteinFill();
  }

  function GenTable(word1, word2) {
    var table = document.createElement('table');
    table.id = 'dist-table';
    for(var i = -1; i < word1.length; i++) {
      var row = document.createElement('tr');
      for(var j = -1; j < word2.length; j++) {
        var col = document.createElement('td');
        if (i == -1 && j > -1) {
          col.textContent = word2[j];
        } else if (j == -1 && i > -1) {
          col.textContent = word1[i];
        } else {
          col.id = i + '-' + j;
        }
        row.appendChild(col);
      }
      table.appendChild(row);
    }
    return table;
  }

  function LookUpTable() {
    this.hashTable = {};
  }

  LookUpTable.prototype = {
    _hash: function(i, j) {
      return i + '-' + j;
    },
    get: function(i, j) {
      return this.hashTable[this._hash(i, j)];
    },
    set: function(i, j, val) {
      this.hashTable[this._hash(i, j)] = val;
    }
  }

  function DistanceMatrix(word1, word2, lookUpTable) {
    this.lookUpTable = lookUpTable;
    this.word1 = word1;
    this.word2 = word2;
    this.matrix = new Array(word1.length);
    for(var i = 0; i < word1.length; i++) {
      this.matrix[i] = new Array(word2.length);
      for(var j = 0; j < word2.length; j++) {
        var val = ( i == 0 ? j : j == 0 ? i : null); 
        this.matrix[i][j] = new DistNode(this.lookUpTable._hash(i, j), val);
        this.matrix[i][j].refreshDom();
        if (!(val == null)) this.lookUpTable.set(i, j, val);
      }
    }
  }

  DistanceMatrix.prototype = {
    levenshteinFill: function() {
      this._dist(this.word1.length - 1, this.word2.length - 1);
      this._decorate();
      return this.matrix[this.word1.length - 1][this.word2.length - 1].val;
    },
    _decorate: function() {
      var currentCell = this.matrix[this.word1.length - 1][this.word2.length - 1];
      var stack = [];
      while(currentCell) {
        stack.push(currentCell);
        currentCell = currentCell.prev;
      }
      var callbackId = window.setInterval(function() {
        if (stack.length > 0) {
          stack.pop()._decorate();
        } else {
          window.clearInterval(callbackId);
        }
      }, 300);
    },
    _dist: function(i, j) {
      //console.log(i + ', ' + j);
      if (typeof this.lookUpTable.get(i, j) == 'number') return this.lookUpTable.get(i, j);
      var i_1Val = this._dist(i-1, j) + 1;
      var j_1Val = this._dist(i, j-1) + 1;
      var i_1_j_1Val = this._dist(i-1,j-1) + (this.word1[i] == this.word2[j] ? 0 : 2);
      if (i_1Val < j_1Val && i_1Val < i_1_j_1Val) {
        this.matrix[i][j].update(this.matrix[i-1][j], i_1Val);
        this.lookUpTable.set(i, j, i_1Val);
      } else if (j_1Val < i_1Val && j_1Val < i_1_j_1Val) {
        this.matrix[i][j].update(this.matrix[i][j-1], j_1Val);
        this.lookUpTable.set(i, j, j_1Val);
      } else {
        this.matrix[i][j].update(this.matrix[i-1][j-1], i_1_j_1Val);
        this.lookUpTable.set(i, j, i_1_j_1Val);
      }
    },
    print: function() {
      for(var i = 0; i < this.matrix.length; i++) {
        var line = [];
        for(var j = 0; j < this.matrix[0].length; j++) {          
          line.push(this.matrix[i][j].val < 10 ? this.matrix[i][j].val + ' ' : this.matrix[i][j].val);
        }
        console.log(line.join(' '));
      }
    }
  }

  function DistNode(nodeID, val) {
    this.prev = null;
    this.val = val;
    this.domNode = nodeID ? document.getElementById(nodeID) : null;
  }

  DistNode.prototype = {
    update: function(node, val) {
      this.prev = node;
      this.val = val;
      this.refreshDom();
    },
    refreshDom: function() {
      if (this.domNode && typeof this.val == 'number') this.domNode.textContent = this.val;
    },
    _decorate: function() {
      if (this.domNode) {
        this.domNode.style['background'] = 'rgb(34, 151, 223)';
      }
    }
  }

  return  {
    calcLevenshtein: Levenshtein,
    genTable: GenTable
  }
})();