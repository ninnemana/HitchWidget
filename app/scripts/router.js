define([
  // Application.
  'app'
],

function(app) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/widget': 'widget'
    },

    index: function() {
      this.lookup = new Lookup();
      this.lookupView = new LookupView({model:this.lookup});
      this.lookup.fetch();
      $('.widget-container').html(this.lookupView.render().el);
    },
    widget: function(){
      this.lookup = new Lookup();
      this.lookupView = new LookupView({model:this.lookup});
      this.lookup.fetch();
      $('.widget-container').html(this.lookupView.render().el);
    }
  });

  return Router;

});
