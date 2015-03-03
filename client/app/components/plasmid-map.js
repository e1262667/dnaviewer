import Ember from 'ember';
import PlasmidMap from 'client/utils/plasmid-map';

export default Ember.Component.extend({
  classNames: ['plasmid-map'],
  didInsertElement: function() {
    var self = this;

    // an instance of the reusable graph
    var graph = new PlasmidMap();

    var $this = $('#' + this.elementId);

    // send a function to call for click events
    graph.options('sendClick', function(id) {
      self.sendAction('click', id);
    });

    // send resize options when the browser is resized
    function updateSize() {
      var scrollBar = 20;
      var width = $this.parent().width() - scrollBar;
      var height = width * 0.5;
      graph.options({
        width: width,
        height: height
      });
      $this.width(width);
      $this.height(height);
    }
    updateSize();
    $(window).resize(updateSize);

    // start the graph
    d3.select($this[0])
      .datum(this.model.dnafeatures)
      .call(graph);

    //hover actions for the list view
    $('.features').hover(function(event) {
      self.sendAction('hoverIn', event);
    }, function(event) {
      self.sendAction('hoverOut', event);
    });
  }
});
