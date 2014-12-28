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

function reset() {  
  document.body.removeChild(document.getElementById('target-list'));
  listGen();
}

function nonBatchUpdate() {
  var promise = new Promise(function(resolve, reject) {
    var start = window.performance.now();
    if (update()) {
      resolve();  
    }
  });
  promise.then(function() {
    setTimeout(reset, 1000);
  });
}

function batchUpdate() {
  var promise = new Promise(function(resolve, reject) {
    window.requestAnimationFrame(update); 
    resolve(); 
  });
  promise.then(function() {
    setTimeout(reset, 1000);
  });
}
