import DS from 'ember-data';
import Category from 'client/models/category';
import Feature from 'client/models/feature';
import File from 'client/models/file';
import MoleculeFeature from 'client/models/molecule-feature';
import Molecule from 'client/models/molecule';
import Organisation from 'client/models/organisation';
import Pattern from 'client/models/pattern';
import Sequence from 'client/models/sequence';
import User from 'client/models/user';

var categories = {};
var features = {};
var files = {};
var moleculeFeatures = {};
var molecules = {};
var organisations = {};
var patterns = {};
var sequences = {};
var users = {};

function setUpCategory(fixtureData) {
  var id = fixtureData.id;
  if (categories[id]) {
    return;
  }

  categories[id] = {
    accession: fixtureData.accession,
    created: fixtureData.created,
    description: fixtureData.description,
    id: id,
    location: fixtureData.location,
    modified: fixtureData.modified,
    name: fixtureData.name,
    namespace: fixtureData.namespace,
    organisation: fixtureData.organisationId,
    properties: fixtureData.properties,
    user: fixtureData.userId
  };
}

function setUpFeature(fixtureData) {
  var id = fixtureData.id;
  if (features[id]) {
    return;
  }

  features[id] = {
    accession: fixtureData.accession,
    category: fixtureData.dnafeaturecategoryId,
    created: fixtureData.created,
    description: fixtureData.description,
    id: id,
    length: fixtureData.length,
    location: fixtureData.location,
    modified: fixtureData.modified,
    name: fixtureData.name,
    namespace: fixtureData.namespace,
    organisation: fixtureData.organisationId,
    pattern: fixtureData.dnafeaturepatternId,
    privacy: fixtureData.privacy,
    properties: fixtureData.properties,
    user: fixtureData.userId
  };

  setUpCategory(fixtureData.category);
  setUpPattern(fixtureData.pattern);
  setUpUser(fixtureData.user);
}

function setUpFile(fixtureData) {
  var id = fixtureData.id;
  if (files[id]) {
    return;
  }

  var file = {};
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      file[i] = fixtureData[i];
    }
  }

  files[id] = file;
}

function setUpMoleculeFeature(fixtureData) {
  var id = fixtureData.dnamoleculeId + '_' + fixtureData.dnafeatureId;
  if (moleculeFeatures[id]) {
    return;
  }

  moleculeFeatures[id] = {
    dnafeature: fixtureData.dnafeatureId,
    dnamolecule: fixtureData.dnamoleculeId,
    end: fixtureData.end,
    id: id,
    start: fixtureData.start,
    strand: fixtureData.strand
  };

  setUpFeature(fixtureData.dnafeature);
}

function setUpMolecule(fixtureData) {
  var id = fixtureData.id;
  if (molecules[id]) {
    return;
  }

  molecules[id] = {
    accession: fixtureData.accession,
    concNgUl: fixtureData.concNgUl,
    created: fixtureData.created,
    deleted: fixtureData.deleted,
    description: fixtureData.description,
    dnafeatures: fixtureData.dnafeatures.map(function(dnafeature) {
      return dnafeature.dnamoleculeId + '_' + dnafeature.dnafeatureId;
    }),
    dnamoleculefile: fixtureData.dnamoleculefileId,
    externalIdentifier: fixtureData.externalIdentifier,
    host: fixtureData.host,
    id: id,
    isAvailable: fixtureData.isAvailable,
    isCircular: fixtureData.isCircular,
    length: fixtureData.length,
    location: fixtureData.location,
    marker: fixtureData.marker,
    modified: fixtureData.modified,
    molWeight: fixtureData.molWeight,
    name: fixtureData.name,
    namespace: fixtureData.namespace,
    organisation: fixtureData.organisationId,
    privacy: fixtureData.privacy,
    properties: fixtureData.properties,
    sequence: fixtureData.sequenceId,
    user: fixtureData.userId
  };

  setUpFile(fixtureData.dnamoleculefile);
  for (var i in fixtureData.dnafeatures) {
    if (fixtureData.dnafeatures.hasOwnProperty(i)) {
      setUpMoleculeFeature(fixtureData.dnafeatures[i]);
    }
  }
  setUpSequence(fixtureData.sequence);
  setUpUser(fixtureData.user);
}

function setUpOrganisation(fixtureData) {
  var id = fixtureData.id;
  if (organisations[id]) {
    return;
  }

  var organisation = {};
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      organisation[i] = fixtureData[i];
    }
  }

  organisations[id] = organisation;
}

function setUpPattern(fixtureData) {
  var id = fixtureData.id;
  if (patterns[id]) {
    return;
  }

  var pattern = {};
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      pattern[i] = fixtureData[i];
    }
  }

  patterns[id] = pattern;
}

function setUpSequence(fixtureData) {
  var id = fixtureData.id;
  if (sequences[id]) {
    return;
  }

  var sequence = {};
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      sequence[i] = fixtureData[i];
    }
  }

  sequences[id] = sequence;
}

function setUpUser(fixtureData) {
  var id = fixtureData.id;
  if (users[id]) {
    return;
  }

  users[id] = {
    csrfToken: fixtureData.csrfToken,
    email: fixtureData.email,
    id: id,
    name: fixtureData.name,
    organisation: fixtureData.organisationId
  };

  setUpOrganisation(fixtureData.organisation);
}

function setUpFixtureData(fixtureData) {
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      setUpMolecule(fixtureData[i]);
    }
  }
}

export function initialize(container, application) {
  setUpFixtureData(application.fixtureData);

  Category.reopenClass({
    FIXTURES: _.values(categories)
  });
  Feature.reopenClass({
    FIXTURES: _.values(features)
  });
  File.reopenClass({
    FIXTURES: _.values(files)
  });
  MoleculeFeature.reopenClass({
    FIXTURES: _.values(moleculeFeatures)
  });
  Molecule.reopenClass({
    FIXTURES: _.values(molecules)
  });
  Organisation.reopenClass({
    FIXTURES: _.values(organisations)
  });
  Pattern.reopenClass({
    FIXTURES: _.values(patterns)
  });
  Sequence.reopenClass({
    FIXTURES: _.values(sequences)
  });
  User.reopenClass({
    FIXTURES: _.values(users)
  });

  application.ApplicationAdapter = DS.FixtureAdapter;
}

export default {
  name: 'fixture-setup',
  initialize: initialize
};
