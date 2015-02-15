import DS from 'ember-data';

export default DS.Model.extend({
  dnafeature: DS.belongsTo('dnafeature'),
  dnamolecule: DS.belongsTo('dnamolecule'),
  end: DS.attr(),
  start: DS.attr(),
  strand: DS.attr()
});
