/*global $:false */
/*global Backbone:false */
  'use strict';
require([
// Application.
'app',

// Main Router.
'router'],
function (app, Router) {

	// Global Variables
	var API_URL = 'https://api.curtmfg.com/v3/';

	// Define your master router on the application namespace and trigger all
	// navigation from this instance.
	app.router = new Router();

	// Trigger the initial route and enable HTML5 History API support, set the
	// root folder to '/' by default.  Change in app.js.
	Backbone.history.start({
	pushState: true,
	root: app.root
	});

	// All navigation that is relative should be passed through the navigate
	// method, to be processed by the router. If the link has a `data-bypass`
	// attribute, bypass the delegation completely.
	$(document).on('click', 'a:not([data-bypass])', function (evt) {
		// Get the absolute anchor href.
		var href = $(this).attr('href');

		// If the href exists and is a hash route, run it through Backbone.
		if (href && href.indexOf('#') === 0) {
			// Stop the default event to ensure the link will not cause a page
			// refresh.
			evt.preventDefault();

			// `Backbone.history.navigate` is sufficient for all Routers and will
			// trigger the correct events. The Router's internal `navigate` method
			// calls this anyways.  The fragment is sliced from the root.
			Backbone.history.navigate(href, true);
		}
	});

	var parseQs = function (name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = '[\\?&]' + name + '=([^&#]*)';
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if (results === null) {
			return '';
		} else {
			return decodeURIComponent(results[1].replace(/\+/g, ' '));
		}
	};

	var VehicleConfiguration = Backbone.Model.extend({
		defaults: {
			'year':0,
			'make':'',
			'model':'',
			'sub_model':'',
			'dynamic_config': []
		},
		toString: function(){
			var str = this.get('year');
			str += ' ' + this.get('make');
			str += ' ' +this.get('model');
			str += ' ' +this.get('sub_model');
			for (var i = this.get('dynamic_config').length - 1; i >= 0; i--) {
				var config = this.get('dynamic_config')[i];
				str += ' ' + config.key + ' ' + config.value;
			}
			return str;
		},
		load_years: function(callback){
			console.log(key);
			$.ajax({
				url: API_URL + 'vehicle',
				type:'get',
				dataType:'json',
				data: {
					'key': key
				},
				success: function(resp,status,xhr){
					callback(resp.ConfigOption.Options);
				},
				error: function(xhr,status,err){
					callback([]);
				}
			});
			//callback([]);
		},
		load_makes: function(callback){
			callback([]);
		},
		load_models: function(callback){
			callback([]);
		},
		load_subs: function(callback){
			callback([]);
		},
		load_config: function(callback){
			callback([]);
		}
	});

	var LookupView = Backbone.View.extend({
		tagName: 'div',
		className: 'widget-container',
		el: '.widget-container',
		events: {
			'change .year':'year_changed',
			'change .make':'make_changed',
			'change .model':'model_changed',
			'change .sub_model':'sub_changed',
			'change .config':'config_changed'
		},
		initialize: function(){
			//this.listenTo(this.model,'change',this.render);
			this.render();
		},
		render: function(){
			if(this.model.get('year') === 0){
				var self = this;
				this.model.load_years(function(years){
					var html = '<select class="year">';
					html += '<option value="0">- Select Year -</option>';
					for (var i = 0; i <= years.length - 1; i++) {
						html += '<option value="' + years[i] +'">' + years[i] + '</option>';
					}
					html += '</select>';

					$(self.el).html(html);
					return this;
				});
			}else if(this.model.has('make')){

			}
		},
		year_changed: function(e){
			this.model.set({
				year:e.currentTarget.value,
				make:undefined,
				model:undefined,
				sub_model:undefined,
				dynamic_config:[]
			});
			this.render();
		},
		make_changed: function(){

		},
		model_changed: function(){

		},
		sub_changed: function(){

		},
		config_changed: function(){

		}
	});

	var widget_container = jQuery('script.hitch-widget');

	var key = $(widget_container).data('key');

	$(widget_container).before('<div class="widget-container"></div>');

	var config = new VehicleConfiguration();
	var lookupView = new LookupView({
		model: config
	});

});