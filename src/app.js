(function() {

  function Reel(element) {
    this.element = element;
  }

  Reel.prototype.spin = function spin(then) {
    // On each call,and recursive call, to spin declare a new time variable and check if 3 seconds have
    // elapsed since the lever was pulled. If it has then call the stop method on the reels.
    var now = new Date().getTime();
    if (now > then + 3000) this.stop();

    var that = this.element;
    that.style.bottom = (that.style.bottom.split('px').shift() - 100) + 'px';
    if (that.style.bottom.split('px').shift() > 0) {
      window.requestAnimationFrame(this.spin.bind(this, then));
    } else {
      that.style.bottom = reelStart;
      window.requestAnimationFrame(this.spin.bind(this, then));
    }
  }

  Reel.prototype.stop = function stop() {
    console.log('STOP!');
  }

  // Select all reels as a node list
  var reelNodes = document.querySelectorAll('.reel');
  // Create a new object for each reel, with a reference to the node in the 'element' property
  var reel1 = new Reel(reelNodes[0]);
  var reel2 = new Reel(reelNodes[1]);
  var reel3 = new Reel(reelNodes[2]);
  var reelObjects = [reel1, reel2, reel3];
  var reelStart = 1410 + 'px';
  // Set initial position of reels
  for (let i = 0; i < reelNodes.length; i++) {
    reelNodes[i].style.bottom = reelStart;
  }

  // On pull of the lever capture the time that the click/pull event happened. Then call the spin
  // method on each of the reel objects, passing the click/pull time as an argument
  var lever = document.getElementById('lever');
  lever.addEventListener('click', function() {
    var time = new Date().getTime();
    var leverSound = new Audio('../src/sounds/lever.mp3').play();
    setTimeout(function() {
      reelObjects.forEach(function(obj, i) {
        return obj.spin(time);
      });
    }, 1000);
  });

})();