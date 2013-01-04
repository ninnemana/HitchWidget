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
      'widget.html/preload':'preload_base',
      'preload/':'preload_base',
      'preload/:year':'preload_year',
      'preload/:year/:make':'preload_make',
      'preload/:year/:make/:model':'preload_model',
      'preload/:year/:make/:model/:submodel':'preload_submodel'
    },

    index: function() {
      console.log('index');
    },
    preload_base:function(){
      console.log('base');
    },
    preload_year:function(year){
      console.log(year);
    },
    preload_make:function(year,make){
      console.log(year,make);
    },
    preload_model:function(year,make,model){
      console.log(year,make,model);
    },
    preload_submodel:function(year,make,model,submodel){
      console.log(year,make,model,submodel);
    }
  });

  return Router;

});