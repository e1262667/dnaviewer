import Ember from 'ember';

export default Ember.Controller.extend({
  orderDnafeatures: function() {
    this.model.get('dnafeatures').then(function(dnafeatures) {
      this.set('dnafeatures', dnafeatures.sortBy('start'));
    }.bind(this));
  }.observes('model.dnafeatures'),

  dnafeaturesChanged: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var el;
      $('.feature-row').hover(function() {
        el = $('.features[name="' + $(this).attr('name') + '"]');
        el.attr('class', (el.attr('class') + ' highlight').trim());
      }, function() {
        el = $('.features[name="' + $(this).attr('name') + '"]');
        el.attr('class', el.attr('class').replace('highlight', '').trim());
      });
    });
  }.observes('dnafeatures'),

  actions: {
    hoverIn: function(event) {
      $('.feature-row[name="' + $(event.target).attr('name') + '"]').addClass('highlight');
    },
    hoverOut: function(event) {
      $('.feature-row[name="' + $(event.target).attr('name') + '"]').removeClass('highlight');
    },
    click: function(id) {
      this.transitionToRoute('feature', id);
    }
  }
});
