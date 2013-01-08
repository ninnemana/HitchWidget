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
			'dynamic_config': [],
			'matched': [],
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
		},
		load_makes: function(callback){
			var self = this;
			$.ajax({
				url: API_URL + 'vehicle/' + self.get('year'),
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
		},
		load_models: function(callback){
			var self = this;
			$.ajax({
				url: API_URL + 'vehicle/' + self.get('year') + '/' + self.get('make'),
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
		},
		load_subs: function(callback){
			var self = this;
			$.ajax({
				url: API_URL + 'vehicle/' + self.get('year') + '/' + self.get('make') + '/' + self.get('model'),
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
		},
		load_config: function(callback){
			var self = this;

			var url = API_URL + 'vehicle/' + self.get('year') + '/' + self.get('make') + '/' + self.get('model') + '/' + self.get('sub_model') + '/';

			var dyn = self.get('dynamic_config');

			if(dyn.length > 0){
				var keys = '',
					values = '';
				for (var i = dyn.length - 1; i >= 0; i--) {
					if(i === dyn.length - 1){
						keys += dyn[i].key;
						values += dyn[i].val;
					}else{
						keys += dyn[i].key + ',';
						values += dyn[i].val + ',';
					}
				}
				url += keys + '/' + values;
			}

			$.ajax({
				url: url,
				type:'get',
				dataType:'json',
				data: {
					'key': key
				},
				success: function(resp,status,xhr){
					callback(resp);

					self.set({
						matched: resp.Matched
					});
				},
				error: function(xhr,status,err){
					callback([]);
				}
			});
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
			var self = this;
			if(this.model.get('year') === 0){
				this.model.load_years(function(years){
					var html = '<select class="year">';
					html += '<option value="0">- Select Year -</option>';
					for (var i = 0; i <= years.length - 1; i++) {
						html += '<option value="' + years[i] +'">' + years[i] + '</option>';
					}
					html += '</select>';

					$(self.el).html(html);
					return self;
				});
			}else if(!this.model.has('make')){
				this.model.load_makes(function(makes){
					var html = '<select class="make">';
					html += '<option value="">- Select Make -</option>';
					for (var i = 0; i <= makes.length - 1; i++) {
						html += '<option value="' + makes[i] +'">' + makes[i] + '</option>';
					}
					html += '</select>';
					$(self.el).html(html);
					return self;
				});
			}else if(!this.model.has('model')){
				this.model.load_models(function(models){
					var html = '<select class="model">';
					html += '<option value="">- Select Model -</option>';
					for (var i = 0; i <= models.length - 1; i++) {
						html += '<option value="' + models[i] +'">' + models[i] + '</option>';
					}
					html += '</select>';
					$(self.el).html(html);
					return self;
				});
			}else if(!this.model.has('sub_model')){
				this.model.load_subs(function(subs){
					var html = '<select class="sub_model">';
					html += '<option value="">- Select Submodel -</option>';
					for (var i = 0; i <= subs.length - 1; i++) {
						html += '<option value="' + subs[i] +'">' + subs[i] + '</option>';
					}
					html += '</select>';
					$(self.el).html(html);
					return self;
				});
			}else{
				this.model.load_config(function(config){

					if(self.model.get('matched').length > 0){
						console.log('load matched');

						// TO DO - fire off part display for newly matched parts
					}

					if(config.ConfigOption !== undefined && config.ConfigOption !== null && config.ConfigOption.Type !== undefined){
						var html = '<select class="config" data-type="' + config.ConfigOption.Type +'">';
						html += '<option value="">- Select ' + config.ConfigOption.Type + ' -</option>';
						for (var i = 0; i <= config.ConfigOption.Options.length - 1; i++) {
							html += '<option value="' + config.ConfigOption.Options[i] +'">' + config.ConfigOption.Options[i] + '</option>';
						}
						html += '</select>';
						$(self.el).html(html);
					}
					return self;
				});
			}
		},
		year_changed: function(e){
			this.model.set({
				year:e.currentTarget.value,
				make:undefined,
				model:undefined,
				sub_model:undefined,
				dynamic_config:[],
				matched: []
			});
			this.render();
		},
		make_changed: function(e){
			this.model.set({
				make:e.currentTarget.value,
				model:undefined,
				sub_model:undefined,
				dynamic_config:[],
				matched: []
			});
			this.render();
		},
		model_changed: function(e){
			this.model.set({
				model:e.currentTarget.value,
				sub_model:undefined,
				dynamic_config:[],
				matched: []
			});
			this.render();
		},
		sub_changed: function(e){
			this.model.set({
				sub_model:e.currentTarget.value,
				dynamic_config:[],
				matched: []
			});
			this.render();
		},
		config_changed: function(e){
			var dyn = this.model.get('dynamic_config');
			dyn.push({key: $(e.currentTarget).data('type'), val: e.currentTarget.value});
			this.model.set({
				dynamic_config: dyn
			});
			this.render();
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