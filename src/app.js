(function() {

  var lever = document.getElementById('lever');
  lever.addEventListener('click', function() {
    var leverSound = new Audio('../src/sounds/lever.mp3').play();
    setTimeout(spin, 1000);
  });

  // Select all reels as a node list
  var reels = document.querySelectorAll('.reel');
  // Select reels individually
  var reel1 = reels[0],
      reel2 = reels[1],
      reel3 = reels[2];
  var reelStart = 1410 + 'px';
  // Set initial position of reels
  for (let i = 0; i < reels.length; i++) {
    reels[i].style.bottom = reelStart;
  }

  function spin() {
    reel1.style.bottom = (reel1.style.bottom.split('px').shift() - 100) + 'px';
    if (reel1.style.bottom.split('px').shift() > 0) {
      window.requestAnimationFrame(spin);
    } else {
      reel1.style.bottom = reelStart;
      window.requestAnimationFrame(spin);
    }
  }

})();