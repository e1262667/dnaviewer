import DS from 'ember-data';

export default DS.Model.extend({
  bases: DS.attr(),
  sha1: DS.attr()
});
