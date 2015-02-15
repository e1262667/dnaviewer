import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('molecules', function() {
    this.resource('molecule', { path: ':molecule_id' });
  });
});

export default Router;
