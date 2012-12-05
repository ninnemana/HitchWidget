/*global $:false */
/*global Backbone:false */

'use strict';

define([
  // Application.
  "app"
],

function(app) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/preload/:year/:make/:model/:submodel': 'preload'
    },

    index: function() {

    },
    preload:function(){
      console.log('preload');
    }
  });

  return Router;

});
