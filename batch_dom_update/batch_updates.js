window.onload = function (){
  listGen();
  document.getElementById('non-batch').addEventListener('click', function(){
    nonBatchUpdate();
  })

  document.getElementById('batch').addEventListener('click', function() {
    batchUpdate();
  })

  window.nonBatchResult = document.getElementById('non-batch-result');
  window.batchResult = document.getElementById('batch-result');
};

function listGen() {  
  var ul = document.createElement('ul');
  ul.id = 'target-list';
  for(var i = 0; i < 1000; i++) {
    var li = document.createElement('li');
    li.textContent = 'List item number ' + i;
    ul.appendChild(li);
  }
  document.body.appendChild(ul);
}


function update() {
  lis = document.getElementsByTagName('li');
  for(var i = 0; i < lis.length; i++) {
    lis[i].classList.add('target');
  }
  return true;
}

function nonBatchUpdate() {
  var promise = new Promise(function(resolve, reject) {
    var start = window.performance.now();
    if (update()) {
      resolve(start);  
    }
  });
  promise.then(function(start) {
    var time = window.performance.now() - start;
    nonBatchResult.dataset['time'] = time;
    nonBatchResult.textContent = time;
    if (batchResult.dataset['time']) {
      nonBatchResult.textContent += '(' + parseInt(time / parseFloat(batchResult.dataset['time'])) + ' times slower !)';
    }
    document.body.removeChild(document.getElementById('target-list'));
    listGen();
  });
}

function batchUpdate() {
  var start = window.performance.now();
  var id = window.requestAnimationFrame(update);
  window.cancelAnimationFrame(id);
  var time = window.performance.now() - start;
  batchResult.dataset['time'] = time;
  batchResult.textContent = time;
  if (nonBatchResult.dataset['time']) {
    batchResult.textContent += '(' + parseInt(parseFloat(nonBatchResult.dataset['time']) / time) + ' times faster! )'
  }
  document.body.removeChild(document.getElementById('target-list'));
  listGen();
}