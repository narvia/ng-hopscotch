function closeTour() {
  if (confirm("This tutorial will not be shown again until you re-visit this page")) {
    hopscotch.endTour(false);
  }
}

angular.module('ngHopscotch', []);

angular.module('ngHopscotch').factory('hopscotch', function() {
  if (!window.hopscotch) {
    throw new Error('Missing hopscotch dependency');
  }

  return window.hopscotch;
});

angular.module('ngHopscotch').factory('HSHelper', function() {
  return {
    extend : function(child, parent) {
      for (var key in parent) {
        if (parent.hasOwnProperty(key)) {
          child[key] = parent[key];
        }
      }
    }
  };
});

angular.module('ngHopscotch').factory('HSCache', function() {
  return {
    isEnded : false,
    isClosed : false
  };
});

angular.module('ngHopscotch').service('HSTour', ['hopscotch', 'HSHelper', 'HSCache', function(hopscotch, HSHelper, HSCache) {
  function HSTour(tour) {
    this.tour = tour;
  };

  HSTour.refresh = function() {
    HSCache = {};
  };

  HSTour.patch = function(tour, isFinal) {
    tour.onEnd = function() {
      HSCache.isEnded = true;
    };

    tour.onClose = function() {
      HSCache.isClosed = true;
    };

    tour.steps.forEach(function(step) {
      step.content = "<button class='hopscotch-bubble-close' style='position:absolute;bottom:20px' href='#' onclick='closeTour()'>Close tour</button>" + step.content;
    });
  };

  HSTour.prototype.init = function(tour) {
    this.tour = tour;
  };

  HSTour.prototype.start = function(isFinal, stepNum) {
    HSTour.patch(this.tour, isFinal);
    if (!isFinal || (isFinal && (!parseInt(localStorage.getItem('HSTour:' + this.tour.id + ':completed')) && (!HSCache.isEnded && !HSCache.isClosed)))) {
      hopscotch.startTour(this.tour, stepNum);
    }
  };

  HSTour.prototype.end = function(clearCookie) {
    hopscotch.endTour(clearCookie);
  };

  HSTour.prototype.bind = function(options) {
    for (var key in options) {
      var step = this.tour.steps.find(function(item) { return item.target === key; });
      if (step) {
        HSHelper.extend(step, options[key]);
      }
    }
  };

  return HSTour;
}]);
