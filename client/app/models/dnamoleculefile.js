import DS from 'ember-data';

export default DS.Model.extend({
  format: DS.attr(),
  name: DS.attr(),
  parsed: DS.attr()
});
