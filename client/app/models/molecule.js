import DS from 'ember-data';

export default DS.Model.extend({
  accession: DS.attr(),
  concNgUl: DS.attr(),
  created: DS.attr(),
  deleted: DS.attr(),
  description: DS.attr(),
  dnafeatures: DS.hasMany('molecule-feature'),
  dnamoleculefile: DS.belongsTo('file'),
  externalIdentifier: DS.attr(),
  host: DS.attr(),
  isAvailable: DS.attr(),
  isCircular: DS.attr(),
  length: DS.attr(),
  location: DS.attr(),
  marker: DS.attr(),
  modified: DS.attr(),
  molWeight: DS.attr(),
  name: DS.attr(),
  namespace: DS.attr(),
  organisation: DS.belongsTo('organisation'),
  privacy: DS.attr(),
  properties: DS.attr(),
  sequence: DS.belongsTo('sequence'),
  user: DS.belongsTo('user')
});
