# dnaviewer
Browser Based Viewer of DNA

## Introduction
I made the app using Ember.js and D3.js. I chose to model the images found when when Google image searching for "plasmid map". I figured I could get more animation capability over using the SBOL symbols.

## Running
From command-line:
```
cd client
npm install
bower install
ember s
```
This runs a local Express.js server at http://localhost:4200.

## Modeling Data
I decided to model the molecule JSON using both Ember Model and raw JSON. Ember Model for easy data-binding. and raw JSON for easy D3 data-binding. All the fixture set up exists as an Ember initializer (client/app/initializers/fiture-setup.js). The models are in (client/app/models/).

## D3
I animated the flowing in of the features, as well as the corresponding labels. I used green to designate forward, red for backward, and yellow for hover. One of the first things I noticed was the overlap between two of the features. I chose to bump any overlapping feature into a lower arc.

I then focused on labels. Getting a label with a line on either end next to the feature was fairly easy, but I noticed that there were a few very short features near the top. This made for some unreadable overlapping labels. I spent a lot of time preventing overlap on the labels, perhaps a little too much time. I used a relaxing function that would run every animation frame. It checks for any overlapping, and if found moves one up a little, then rinse and repeat. My way of doing this could probably be optimized further.

## Hovering
Next was hovering. I used CSS hovering styles, as well as JavaScript events to make the corresponding path or row hover with it. This gives context of where your features are and what properties they have.

## Routing
The routing is pretty straightforward. You start with a molecules list of one. Then drill down into the molecule's graph and feature list. Then you can drill down into a feature using the list or the graph sections. I added a slide animation when you drill in and out of the feature route.

## Design
As you can see, I went as straight-forward as possible on the design and styling. I do use the Sass CSS pre-compiler to cut down on redundancy by using nesting.

## Tests
If you visit http://localhost:4200/tests, you will see all the default tests that Ember-CLI generates for you. I decided in the sake of time to leave the default tests as-is. This is why there are a lot of errors. They are mostly undefined exceptions because dependencies weren't injected.
