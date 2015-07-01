(function() {

  function getStyle(prop, element) {
    return window.getComputedStyle(element).getPropertyValue(prop); 
  }

  var lever = document.getElementById('lever');
  lever.addEventListener('click', spin);
  var reel1 = document.querySelector('.reel-1');

  // Set initial position of reel
  var reel1Start = reel1.style.bottom = 1410 + 'px';

  function spin() {
    reel1.style.bottom = (reel1.style.bottom.split('px').shift() - 20) + 'px';
    if (reel1.style.bottom.split('px').shift() > 0) {
      window.requestAnimationFrame(spin);
    } else {
      reel1.style.bottom = reel1Start;
      window.requestAnimationFrame(spin);
    }
  }

})();