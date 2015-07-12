(function() {

  function Reel(element, id) {
    this.element = element;
    this.moving = false;
    this.imageShowing = null;
  }

  Reel.prototype.spin = function spin(eachSpinDistance) {
    this.moving = true;
    var that = this.element;

    // Every time the spin method is called on a reel, the distance in pixels that the reel moves will be reduced until it reaches 1px.
    // When this happens the program will start querying the icon showing on the slot-machine screen, and when one is showing, the stop
    // method will be called.
    if (eachSpinDistance > 2.0) eachSpinDistance = eachSpinDistance - 0.1;
    else this.getImageOnScreen.bind(this)();

    // Once the distance of each spin has slowed down to 1px, and there is an image fully displayed on the screen,
    // change the 'moving' property to false.
    if (this.imageShowing) {
      this.moving = false;
    }

    if (this.moving !== false) {
      that.style.bottom = (that.style.bottom.split('px').shift() - eachSpinDistance) + 'px';
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
    stopped++;
    didPlayerWin(function(answer) {
      if (answer) {
        jackpotSound.play();
        var interval = setInterval(function() {
          winMessage.style.visibility = (winMessage.style.visibility === 'hidden') ? 'visible' : 'hidden';
        }, 300);
        setTimeout(function() {
          clearInterval(interval);
          winMessage.style.visibility = 'visible';
          button.disabled = false;
          button.style.backgroundColor = '#E8341B';
        }, 5000);
      } else {
        finishSound.play();
        button.disabled = false;
        button.style.backgroundColor = '#E8341B';
      }
      reelObjects.forEach(function(reel) {
        // Reset the imageShowing property for each reel so that additional spins are possible
        return reel.imageShowing = null;
      });
    });
  }

  Reel.prototype.getImageOnScreen = function() {
    var reelImages = this.element.childNodes;
    for (let i = 0; i < reelImages.length; i++) {
      if (reelImages[i].nodeType !== 3) {
        var place = reelImages[i].getBoundingClientRect();
        if (place.top > slotScreen.top + 10 && place.bottom < slotScreen.bottom) {
          this.imageShowing = reelImages[i];
          return false;
        } else {
          if (this.imageShowing !== null) this.imageShowing = null;
        }
      } 
    }
  }

  function didPlayerWin(callback) {
    // Only get the answer if all reels have stopped turning
    if (stopped === 3) {
      // Reset the stopped variable for future spins
      stopped = 0;
      var eachImgSrc = [];
      for (let i = 0; i < reelObjects.length; i++) {
        eachImgSrc.push(reelObjects[i].imageShowing.src);
      }
      // If the src attribute is the same for all images showing on the screen return it (string is truthy),
      // or if they aren't return false.
      var answer = eachImgSrc.reduce(function(pre, cur) {
        return pre === cur ? cur : false;
      });
      callback(answer);
    }
  }

  function randomNumberBetween(lowest, highest) {
    return Math.floor(Math.random() * (highest - lowest + 1)) + lowest;
  }

  var slotScreen = document.getElementById('screen').getBoundingClientRect();
  // Select all reels as a node list
  var reelNodes = document.querySelectorAll('.reel');
  // Create a new object for each reel, with a reference to the node in the 'element' property
  var reel1 = new Reel(reelNodes[0], 1);
  var reel2 = new Reel(reelNodes[1], 2);
  var reel3 = new Reel(reelNodes[2], 3);
  var stopped = 0;
  var reelObjects = [reel1, reel2, reel3];
  var winMessage = document.getElementById('winMessage');
  winMessage.style.visibility = 'hidden';
  // Sounds
  var machineSounds = [
    new Audio('../src/sounds/machine-01.mp3'), 
    new Audio('../src/sounds/machine-02.mp3'), 
    new Audio('../src/sounds/machine-03.mp3'), 
    new Audio('../src/sounds/machine-04.mp3')
  ];
  var finishSound = new Audio('../src/sounds/finish.mp3');
  var jackpotSound = new Audio('../src/sounds/jackpot.mp3');
  var buttonSound = new Audio('../src/sounds/button.mp3');

  var reelStart = 1927 + 'px';
  // Set initial position of reels
  for (let i = 0; i < reelNodes.length; i++) {
    reelNodes[i].style.bottom = reelStart;
  }

  // On press of the button calls the spin method on each of the reel objects, passing a random number between 20 and 100 as an argument. This 
  // random number will be the number of pixels that the reel moves on the initial spin. The number will get smaller on each subsequent spin.
  var button = document.getElementById('button');
  button.addEventListener('click', function() {
    if (winMessage.style.visibility === 'visible') winMessage.style.visibility = 'hidden';
    buttonSound.play();
    this.disabled = true;
    this.style.backgroundColor = '#898682';
    setTimeout(function() {
      machineSounds[randomNumberBetween(0, 3)].play();
      reelObjects.forEach(function(obj) {
        return obj.spin(randomNumberBetween(20, 100));
      });
    }, 500);
  });

})();