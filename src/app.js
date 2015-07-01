(function() {

  function Reel(element) {
    this.element = element;
  }
  Reel.prototype.spin = function spin() {
    var that = this.element;
    that.style.bottom = (that.style.bottom.split('px').shift() - 100) + 'px';
    if (that.style.bottom.split('px').shift() > 0) {
      window.requestAnimationFrame(this.spin.bind(this));
    } else {
      that.style.bottom = reelStart;
      window.requestAnimationFrame(this.spin.bind(this));
    }
  }

  // Select all reels as a node list
  var reels = document.querySelectorAll('.reel');
  // Create a new object for each reel, with a reference to the node in the 'element' property
  var reel1 = new Reel(reels[0]);
  var reel2 = new Reel(reels[1]);
  var reel3 = new Reel(reels[2]);
  var reelStart = 1410 + 'px';
  // Set initial position of reels
  for (let i = 0; i < reels.length; i++) {
    reels[i].style.bottom = reelStart;
  }

  var lever = document.getElementById('lever');
  lever.addEventListener('click', function() {
    var leverSound = new Audio('../src/sounds/lever.mp3').play();
    setTimeout(function() {
      reel1.spin();
      reel2.spin();
      reel3.spin();
    }, 1000);
  });

})();