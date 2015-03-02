import Ember from 'ember';
import PlasmidMap from 'client/utils/plasmid-map';

export default Ember.Component.extend({
  classNames: ['plasmid-map'],
  didInsertElement: function() {
    var graph = new PlasmidMap();
    var self = this;

    var $this = $('#' + this.elementId);

    graph.options('sendClick', function(id) {
      self.sendAction('click', id);
    });

    function updateSize() {
      var width = $this.parent().width() - 20;
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

    d3.select($this[0])
      .datum(this.model.dnafeatures)
      .call(graph);

    $('.cds').hover(function(event) {
      self.sendAction('hoverIn', event);
    }, function(event) {
      self.sendAction('hoverOut', event);
    });
  }
});
