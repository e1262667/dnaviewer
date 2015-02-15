import DS from 'ember-data';

export default DS.Model.extend({
  bases: DS.attr(),
  isIndexed: DS.attr(),
  sha1: DS.attr()
});
