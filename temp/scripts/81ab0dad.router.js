/*global $:false */
/*global Backbone:false */

'use strict';

define([
	// Application.
	'app'
],

function(app) {

	// Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			':year':'preload_year',
			':year/:make':'preload_make',
			':year/:make/:model':'preload_model',
			':year/:make/:model/:submodel':'preload_submodel',
			':year/:make/:model/:submodel/:config_types/:config_values':'preload_config'
		}
	});
	return Router;

});