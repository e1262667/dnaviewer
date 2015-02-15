import DS from 'ember-data';
import DnaFeature from 'client/models/dnafeature';
import DnaFeatureCategory from 'client/models/dnafeaturecategory';
import DnaFeaturePattern from 'client/models/dnafeaturepattern';
import DnaMoleculeDnaFeature from 'client/models/dnamolecule-dnafeature';
import DnaMolecule from 'client/models/dnamolecule';
import DnaMoleculeFile from 'client/models/dnamoleculefile';
import Organisation from 'client/models/organisation';
import Sequence from 'client/models/sequence';
import User from 'client/models/user';

var dnaFeatures = {};
var dnaFeatureCategories = {};
var dnaFeaturePatterns = {};
var dnaMoleculeDnaFeatures = {};
var dnaMolecules = {};
var dnaMoleculeFiles = {};
var organisations = {};
var sequences = {};
var users = {};

function setUpDnaFeature(fixtureData) {
  var id = fixtureData.id;
  if (dnaFeatures[id]) {
    return;
  }

  dnaFeatures[id] = {
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

  setUpDnaFeatureCategory(fixtureData.category);
  setUpDnaFeaturePattern(fixtureData.pattern);
  setUpUser(fixtureData.user);
}

function setUpDnaFeatureCategory(fixtureData) {
  var id = fixtureData.id;
  if (dnaFeatureCategories[id]) {
    return;
  }

  dnaFeatureCategories[id] = {
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

function setUpDnaFeaturePattern(fixtureData) {
  var id = fixtureData.id;
  if (dnaFeaturePatterns[id]) {
    return;
  }

  var dnaFeaturePattern = {};
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      dnaFeaturePattern[i] = fixtureData[i];
    }
  }

  dnaFeaturePatterns[id] = dnaFeaturePattern;
}

function setUpDnaMoleculeDnaFeature(fixtureData) {
  var id = fixtureData.dnamoleculeId + '_' + fixtureData.dnafeatureId;
  if (dnaMoleculeDnaFeatures[id]) {
    return;
  }

  dnaMoleculeDnaFeatures[id] = {
    dnafeature: fixtureData.dnafeatureId,
    dnamolecule: fixtureData.dnamoleculeId,
    end: fixtureData.end,
    id: id,
    start: fixtureData.start,
    strand: fixtureData.strand
  };

  setUpDnaFeature(fixtureData.dnafeature);
}

function setUpDnaMolecule(fixtureData) {
  var id = fixtureData.id;
  if (dnaMolecules[id]) {
    return;
  }

  dnaMolecules[id] = {
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

  for (var i in fixtureData.dnafeatures) {
    if (fixtureData.dnafeatures.hasOwnProperty(i)) {
      setUpDnaMoleculeDnaFeature(fixtureData.dnafeatures[i]);
    }
  }
  setUpDnaMoleculeFile(fixtureData.dnamoleculefile);
  setUpSequence(fixtureData.sequence);
  setUpUser(fixtureData.user);
}

function setUpDnaMoleculeFile(fixtureData) {
  var id = fixtureData.id;
  if (dnaMoleculeFiles[id]) {
    return;
  }

  var dnaMoleculeFile = {};
  for (var i in fixtureData) {
    if (fixtureData.hasOwnProperty(i)) {
      dnaMoleculeFile[i] = fixtureData[i];
    }
  }

  dnaMoleculeFiles[id] = dnaMoleculeFile;
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
      setUpDnaMolecule(fixtureData[i]);
    }
  }
}

export function initialize(container, application) {
  setUpFixtureData(application.fixtureData);

  DnaFeature.reopenClass({
    FIXTURES: _.values(dnaFeatures)
  });
  DnaFeatureCategory.reopenClass({
    FIXTURES: _.values(dnaFeatureCategories)
  });
  DnaFeaturePattern.reopenClass({
    FIXTURES: _.values(dnaFeaturePatterns)
  });
  DnaMoleculeDnaFeature.reopenClass({
    FIXTURES: _.values(dnaMoleculeDnaFeatures)
  });
  DnaMolecule.reopenClass({
    FIXTURES: _.values(dnaMolecules)
  });
  DnaMoleculeFile.reopenClass({
    FIXTURES: _.values(dnaMoleculeFiles)
  });
  Organisation.reopenClass({
    FIXTURES: _.values(organisations)
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
