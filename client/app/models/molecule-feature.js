import DS from 'ember-data';

export default DS.Model.extend({
  dnafeature: DS.belongsTo('feature', { async: true }),
  dnamolecule: DS.belongsTo('molecule', { async: true }),
  end: DS.attr(),
  start: DS.attr(),
  strand: DS.attr()
});
