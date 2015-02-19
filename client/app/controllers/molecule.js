import Ember from 'ember';

export default Ember.Controller.extend({
  orderDnafeatures: function() {
    this.model.get('dnafeatures').then(function(dnafeatures) {
      this.set('dnafeatures', dnafeatures.sortBy('start'));
    }.bind(this));
  }.observes('model.dnafeatures')
});
