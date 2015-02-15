import DS from 'ember-data';

export default DS.Model.extend({
  dnafeature: DS.belongsTo('feature'),
  dnamolecule: DS.belongsTo('molecule'),
  end: DS.attr(),
  start: DS.attr(),
  strand: DS.attr()
});
