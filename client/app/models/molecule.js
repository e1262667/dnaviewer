import DS from 'ember-data';

export default DS.Model.extend({
  accession: DS.attr(),
  concNgUl: DS.attr(),
  created: DS.attr(),
  deleted: DS.attr(),
  description: DS.attr(),
  dnafeatures: DS.hasMany('molecule-feature', { async: true }),
  dnamoleculefile: DS.belongsTo('file', { async: true }),
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
  organisation: DS.belongsTo({ async: true }),
  privacy: DS.attr(),
  properties: DS.attr(),
  sequence: DS.belongsTo({ async: true }),
  user: DS.belongsTo({ async: true }),

  // this is used for easy D3 binding ignoring promises
  raw: DS.attr()
});
