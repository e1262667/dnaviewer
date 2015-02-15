import DS from 'ember-data';

export default DS.Model.extend({
  adminEmail: DS.attr(),
  adminName: DS.attr(),
  dateJoined: DS.attr(),
  domain: DS.attr(),
  location: DS.attr(),
  name: DS.attr()
});
