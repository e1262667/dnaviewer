import DS from 'ember-data';

export default DS.Model.extend({
  csrfToken: DS.attr(),
  email: DS.attr(),
  name: DS.attr(),
  organisation: DS.belongsTo('organisation')
});
