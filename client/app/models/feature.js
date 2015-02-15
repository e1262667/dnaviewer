import DS from 'ember-data';

export default DS.Model.extend({
  accession: DS.attr(),
  category: DS.belongsTo('category'),
  created: DS.attr(),
  description: DS.attr(),
  length: DS.attr(),
  location: DS.attr(),
  modified: DS.attr(),
  name: DS.attr(),
  namespace: DS.attr(),
  organisation: DS.belongsTo('organisation'),
  pattern: DS.belongsTo('pattern'),
  privacy: DS.attr(),
  properties: DS.attr(),
  user: DS.belongsTo('user')
});
