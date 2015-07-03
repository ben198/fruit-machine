(function() {

  function Reel(element) {
    this.element = element;
    this.moving = false;
    this.imageShowing = null;
  }

  Reel.prototype.spin = function spin(then) {
    this.moving = true;
    this.getImageOnScreen.bind(this)();
    // On each call,and recursive call, to spin declare a new time variable and check if 3 seconds have
    // elapsed since the lever was pulled. If it has then call the stop method on the reels.
    var now = new Date().getTime();
    // Once 3 seconds have gone, and there is an image fully displayed on the screen, change the 'moving' property to false
    if (now > then + 3000 && this.imageShowing) {
      this.moving = false;
    }
    var that = this.element;
    that.style.bottom = (that.style.bottom.split('px').shift() - 1) + 'px';
    if (this.moving !== false) {
      if (that.style.bottom.split('px').shift() > 0) {
        setTimeout(this.spin.bind(this, then), 1);
      } else {
        that.style.bottom = reelStart;
        setTimeout(this.spin.bind(this, then), 1);
      }
    } else {
      return this.stop();
    }
  }

  Reel.prototype.stop = function stop() {
    console.log('STOP!');
  }

  Reel.prototype.getImageOnScreen = function() {
    var reelImages = this.element.childNodes;
    for (let i = 0; i < reelImages.length; i++) {
      if (reelImages[i].nodeType !== 3) {
        var place = reelImages[i].getBoundingClientRect();
        if (place.top > slotScreen.top && place.bottom < slotScreen.bottom) {
          this.imageShowing = reelImages[i];
          return false;
        } else {
          this.imageShowing = null;
        }
      } 
    }
  }

  var slotScreen = document.getElementById('screen').getBoundingClientRect();
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