import DS from 'ember-data';

export default DS.Model.extend({
  accession: DS.attr(),
  created: DS.attr(),
  description: DS.attr(),
  location: DS.attr(),
  modified: DS.attr(),
  name: DS.attr(),
  namespace: DS.attr(),
  organisation: DS.belongsTo('organisation'),
  properties: DS.attr(),
  user: DS.belongsTo('user')
});
