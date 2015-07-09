(function() {

  function Reel(element, id) {
    this.element = element;
    this.moving = false;
    this.imageShowing = null;
    this.sound = new Audio('../src/sounds/slot-' + id + '.mp3');
  }

  Reel.prototype.spin = function spin(eachSpinDistance) {
    this.moving = true;
    // Once the distance of each spin has slowed down to 1px, and there is an image fully displayed on the screen,
    // change the 'moving' property to false.
    if (this.imageShowing) {
      this.moving = false;
    }
    var that = this.element;

    // Every time the spin method is called on a reel, the distance in pixels that the reel moves will be reduced until it reaches 1px.
    // When this happens the program will start querying the icon showing on the slot-machine screen, and when one is showing, the stop
    // method will be called.
    if (eachSpinDistance > 1.0) eachSpinDistance = eachSpinDistance - 0.1;
    else this.getImageOnScreen.bind(this)();

    that.style.bottom = (that.style.bottom.split('px').shift() - eachSpinDistance) + 'px';
    if (this.moving !== false) {
      if (that.style.bottom.split('px').shift() > 0) {
        setTimeout(this.spin.bind(this, eachSpinDistance), 1);
      } else {
        that.style.bottom = reelStart;
        setTimeout(this.spin.bind(this, eachSpinDistance), 1);
      }
    } else {
      return this.stop();
    }
  }

  Reel.prototype.stop = function stop() {
    this.sound.play();
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

  function didPlayerWin() {
    var eachImgSrc = [];
    for (let i = 0; i < reelObjects.length; i++) {
      eachImgSrc.push(reelObjects[i].imageShowing.src);
    }
    // If the src attribute is the same for all images showing on the screen return it (string is truthy),
    // or if they aren't return false.
    return eachImgSrc.reduce(function(pre, cur) {
      return pre === cur ? cur : false;
    });
  }

  var slotScreen = document.getElementById('screen').getBoundingClientRect();
  // Select all reels as a node list
  var reelNodes = document.querySelectorAll('.reel');
  // Create a new object for each reel, with a reference to the node in the 'element' property
  var reel1 = new Reel(reelNodes[0], 1);
  var reel2 = new Reel(reelNodes[1], 2);
  var reel3 = new Reel(reelNodes[2], 3);
  var reelObjects = [reel1, reel2, reel3];
  var reelStart = 1356 + 'px';
  // Set initial position of reels
  for (let i = 0; i < reelNodes.length; i++) {
    reelNodes[i].style.bottom = reelStart;
  }

  // On pull of the lever call the spin method on each of the reel objects, passing a random number between 20 and 100 as an argument. This 
  // random number will be the number of pixels that the reel moves on the initial spin. The number will get smaller on each subsequent spin.
  var lever = document.getElementById('lever');
  lever.addEventListener('click', function() {
    new Audio('../src/sounds/lever.mp3').play();
    setTimeout(function() {
      reelObjects.forEach(function(obj) {
        return obj.spin(Math.floor(Math.random() * (100 - 20 + 1)) + 20);
      });
    }, 1000);
  });

})();