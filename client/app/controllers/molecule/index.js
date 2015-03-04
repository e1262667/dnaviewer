import Ember from 'ember';

function getFeature() {
  return $('.features[name="' + $(this).attr('name') + '"]');
}

function highlightFeature() {
  var feature = getFeature.call(this);
  feature.attr('class', (feature.attr('class') + ' highlight').trim());
}

function unhighlightFeature() {
  var feature = getFeature.call(this);
  feature.attr('class', feature.attr('class').replace('highlight', '').trim());
}

function getFeatureRow(event) {
  return $('.feature-row[name="' + $(event.target).attr('name') + '"]');
}

export default Ember.Controller.extend({
  orderDnafeatures: function() {
    this.model.get('dnafeatures').then(function(dnafeatures) {
      this.set('dnafeatures', dnafeatures.sortBy('start'));
    }.bind(this));
  }.observes('model.dnafeatures'),

  dnafeaturesChanged: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $('.feature-row').hover(highlightFeature, unhighlightFeature);
    });
  }.observes('dnafeatures'),

  actions: {
    hoverIn: function(event) {
      getFeatureRow(event).addClass('highlight');
    },
    hoverOut: function(event) {
      getFeatureRow(event).removeClass('highlight');
    },
    click: function(id) {
      this.transitionToRoute('feature', id);
    }
  }
});
