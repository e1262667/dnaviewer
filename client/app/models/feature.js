import DS from 'ember-data';

export default DS.Model.extend({
  accession: DS.attr(),
  category: DS.belongsTo({ async: true }),
  created: DS.attr(),
  description: DS.attr(),
  length: DS.attr(),
  location: DS.attr(),
  modified: DS.attr(),
  name: DS.attr(),
  namespace: DS.attr(),
  organisation: DS.belongsTo({ async: true }),
  pattern: DS.belongsTo({ async: true }),
  privacy: DS.attr(),
  properties: DS.attr(),
  user: DS.belongsTo({ async: true })
});
