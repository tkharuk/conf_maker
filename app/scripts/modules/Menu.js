'use strict';
var menuToggler = document.getElementById('cm_menuToggle');
var menuItems = document.getElementById('cm_menuItems');
var overlay = document.getElementById('cm_darkenScreen');
var links = menuItems.getElementsByClassName('menu__item');

menuToggler.addEventListener('click', toggleMenu);
menuItems.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

function toggleMenu() {
  menuItems.classList.toggle('menu--visible');
  overlay.classList.toggle('darkenScreen--visible');
}

Array.prototype.forEach.call(links, function(link) {
  link.addEventListener('click', menuLinkHandler);
});

function menuLinkHandler(e) {
  e.preventDefault();
  var getId = function(id) {
    return document.getElementById(id);
  };
  var menuMeasure = getId('menu').offsetHeight || getId('cm_menuToggle').offsetHeight;

  var menuHeight = menuMeasure;
  var hash = e.target.href.substr(e.target.href.indexOf('#') + 1);
  var anchor = document.getElementById(hash);
  var targetY = anchor.offsetTop - menuHeight;

  scrollTo(targetY, 300);
}

function scrollTo(to, duration) {
  if (duration < 0) {
    return;
  }
  //This is for IE compability
  var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  var difference = to - top;
  var perTick = difference / duration * 10;

  setTimeout(function() {
    window.scroll(0, top + perTick);
    if (top == to) {
      //this is to prevent scrolling to top
      //after animation has been done in IE
      window.scroll(0, to);
      return;
    }
    scrollTo(to, duration - 10);
  }, 10);
}
