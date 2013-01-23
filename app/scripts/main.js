/*global $:false */
/*global Backbone:false */
  'use strict';
require([
// Application.
'app',

// Main Router.
'router'],
function (app, Router) {

	var year_select = '<select class="year"><option value="0">- Select Year -</option></select>',
		make_select = '<select class="make"><option value="0">- Select Make -</option></select>',
		model_select = '<select class="model"><option value="0">- Select Model -</option></select>',
		widget_container_html = $('.widget-container-tmpl').text(),
		API_URL = 'https://api.curtmfg.com/v3/';

	// Define your master router on the application namespace and trigger all
	// navigation from this instance.
	app.router = new Router();

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
			var str = this.get('year') || '';
			str += ' ' + (this.get('make') || '');
			str += ' ' + (this.get('model') || '');
			str += ' ' + (this.get('sub_model') || '');
			for (var i = this.get('dynamic_config').length - 1; i >= 0; i--) {
				var dyn = this.get('dynamic_config')[i];
				str += ' ' + dyn.val;
			}
			return str;
		},
		get_info: function(){
			var html ='';
			if(this.has('year')){
				html += '<a href="#">' + this.get('year') + '</a> ';
			}
			if(this.has('make')){
				html += '<a href="#' + this.get('year') + '">' + this.get('make') + '</a> ';
			}
			if(this.has('model')){
				html += '<a href="#' + this.get('year') + '/' + this.get('make') + '">' + this.get('model') + '</a> ';
			}
			if(this.has('sub_model')){
				html += '<a href="#' + this.get('year') + '/' + this.get('make') + '/' + this.get('model') + '">' + this.get('sub_model') + '</a> ';
			}
			if(this.has('dynamic_config') && this.get('dynamic_config').length > 0){

				var dyn = this.get('dynamic_config');

				console.log(dyn.length);
				if(dyn.length === 1){
					html += '<a href="#' + this.get('year') + '/' + this.get('make') + '/' + this.get('model') + '/' + this.get('sub_model') + '">' + dyn[0].val + '</a> ';
				}else{
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
					html += '<a href="#' + this.get('year') + '/' + this.get('make') + '/' + this.get('model') + '/' + this.get('sub_model') + '/' + keys + '/' + values + '">' + values + '</a> ';
				}
			}
			if(this.has('year')){
				$('.widget_container .clear').show();
				//html += '<a href="#" class="clear">Reset</a>';
			}
			return html;
			
		},
		load_years: function(callback){
			var self = this;
			$.ajax({
				url: API_URL + 'vehicle',
				type:'get',
				dataType:'json',
				data: {
					'key': key
				},
				success: function(resp,status,xhr){
					partView.model.add(resp.Matched);
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
					partView.model.add(resp.Matched);
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
					partView.model.add(resp.Matched);
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
					partView.model.add(resp.Matched);
					callback(resp.ConfigOption.Options);
				},
				error: function(xhr,status,err){
					callback([]);
				}
			});
		},
		load_config: function(callback){
			var self = this,
				url = API_URL + 'vehicle/' + self.get('year') + '/' + self.get('make') + '/' + self.get('model') + '/' + self.get('sub_model') + '/',
				dyn = self.get('dynamic_config');

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
					partView.model.add(resp.Matched);
					callback(resp.ConfigOption);
				},
				error: function(xhr,status,err){
					callback([]);
				}
			});
		}
	});

	var PartResults = Backbone.Model.extend({
		defaults:{
			'categories':[]
		},
		add:function(match){
			var matched = [];
			if(Object.prototype.toString.call(match) !== '[object Array]'){
				matched.push(match);
			}else{
				matched = match;
			}

			var cats = this.get('categories') || [];
			for (var i = 0; i < matched.length; i++) {
				for (var j = 0; j < cats.length; j++) {
					if(cats[j].Category === matched[i].Category){
						cats.splice(j, j+1);
					}
				}
				cats.push(matched[i]);
			}
			if(cats !== this.get('categoires') && cats.length > 0){
				part_results.set({'categories':cats});
				part_results.trigger('change:categories');
			}
		},
		matches:function(cat_title){
			var cats = this.get('categories');
			for (var i = 0; i < cats.length; i++) {
				if(cat_title === cats[i].Category){
					return cats[i].Parts;
				}
			}
		},
		load_parts:function(cat_title,callback){
			var part_ids = this.matches(cat_title);
			var parts_str = '';
			for (var i = 0; i < part_ids.length; i++) {
				if(i !== 0){
					parts_str += ',' + part_ids[i];
				}else{
					parts_str = part_ids[i];
				}
			}
			$.ajax({
				url: API_URL + '/parts/' + parts_str,
				type:'get',
				dataType: 'json',
				data:{
					'key':key
				},
				success: function(resp,status,xhr){
					callback(resp);
				},
				error: function(xhr,status,err){
					callback([]);
				}
			});
		},
		load_new:function(){
			console.error('load new called');
		}
	});

	var LookupView = Backbone.View.extend({
		tagName: 'div',
		className: 'select-area',
		el: '.select-area',
		events: {
			'change .select-area':'lookup_changed',
			'change .year':'year_changed',
			'change .make':'make_changed',
			'change .model':'model_changed',
			'change .sub_model':'sub_changed',
			'change .config':'config_changed'
		},
		initialize: function(){
			_.bindAll(this);
			//this.listenTo(this.model,'change',this.render);
			this.render();
		},
		render: function(){
			var self = this;
			partView.model.unset('categories');
			$('.widget_container .clear').hide();


			(function(){
				var html = self.model.get_info();
				$('.vehicle-info').html(html);
			})();

			if(!this.model.has('year') || this.model.get('year') === 0){
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
				this.model.load_config(function(option){
					if(option !== undefined && option !== null && option.Type !== undefined && option.Options.length > 0){
						var html = '<select class="config" data-type="' + option.Type +'">';
						html += '<option value="">- Select ' + option.Type + ' -</option>';
						for (var i = 0; i <= option.Options.length - 1; i++) {
							html += '<option value="' + option.Options[i] +'">' + option.Options[i] + '</option>';
						}
						html += '</select>';
						$(self.el).html(html);
					}
					return self;
				});
			}
		},
		lookup_changed:function(e){
			console.log(e.currentTarget);
			console.log('something changed');
		},
		year_changed: function(e){
			Backbone.history.navigate(e.currentTarget.value, true);
		},
		make_changed: function(e){
			Backbone.history.navigate(this.model.get('year') + '/' + e.currentTarget.value,true);
		},
		model_changed: function(e){
			Backbone.history.navigate(this.model.get('year')  +'/' + this.model.get('make') + '/' + e.currentTarget.value,true);
		},
		sub_changed: function(e){
			Backbone.history.navigate(this.model.get('year')  +'/' + this.model.get('make') + '/'  + this.model.get('model') + '/' + e.currentTarget.value,true);
		},
		config_changed: function(e){
			if(e.currentTarget.value.length > 0){
				var path = this.model.get('year')  +'/' + this.model.get('make') + '/'  + this.model.get('model') + '/' + this.model.get('sub_model') + '/';
				var dyn = this.model.get('dynamic_config');
				dyn.push({key: $(e.currentTarget).data('type'), val: e.currentTarget.value});

				var keys = '',
					values = '';
				for (var i = dyn.length - 1; i >= 0; i--) {
					if(i === dyn.length - 1 && keys.indexOf(dyn[i].key) === -1 && values.indexOf(dyn[i].val) === -1){
						keys += dyn[i].key;
						values += dyn[i].val;
					}else if(keys.indexOf(dyn[i].key) === -1 && values.indexOf(dyn[i].val) === -1){
						keys += dyn[i].key + ',';
						values += dyn[i].val + ',';
					}
				}
				path += keys + '/' + values;

				Backbone.history.navigate(path,true);
			}
		}
	});

	var PartResultsView = Backbone.View.extend({
		tagName: 'div',
		className: 'widget-results',
		el: '.widget-results',
		events: {
			
		},
		initialize: function(){
			//this.listenTo(this.model,'change',this.render);
			this.render();
		},
		render: function(){
			var self = this;
			var cats = this.model.get('categories') || [];
			var html = '';
			for (var i = 0; i < cats.length; i++) {
				var cat = cats[i];
				var tmpl = $('.matched-part-tmpl').html();
				html += _.template(tmpl,cat);
			}
			$(self.el).html(html);
			return self;
		}
	});

	var widget_container = jQuery('script.hitch-widget'),
		config = new VehicleConfiguration(),
		part_results = new PartResults(),
		lookupView,
		partView;


	var key = $(widget_container).data('key');
	console.log(widget_container_html);
	$(widget_container).before(widget_container_html);

	

	app.router.on('route:index',function(){
		partView = new PartResultsView({
			model: part_results
		});
		config.set({
			year: undefined,
			make: undefined,
			model:undefined,
			sub_model:undefined,
			dynamic_config:[]
		});
		lookupView = new LookupView({
			model: config
		});
	});

	app.router.on('route:preload_year',function(year){
		partView = new PartResultsView({
			model: part_results
		});
		config.set({
			year: year,
			make: undefined,
			model:undefined,
			sub_model:undefined,
			dynamic_config:[]
		});
		lookupView = new LookupView({
			model: config
		});
	});

	app.router.on('route:preload_make',function(year,make){
		partView = new PartResultsView({
			model: part_results
		});
		config.set({
			year: year,
			make: make,
			model:undefined,
			sub_model:undefined,
			dynamic_config:[]
		});
		lookupView = new LookupView({
			model: config
		});
	});

	app.router.on('route:preload_model',function(year,make,model){
		partView = new PartResultsView({
			model: part_results
		});
		config.set({
			year: year,
			make: make,
			model:model,
			sub_model:undefined,
			dynamic_config:[]
		});
		lookupView = new LookupView({
			model: config
		});
	});

	app.router.on('route:preload_submodel',function(year,make,model,submodel){
		partView = new PartResultsView({
			model: part_results
		});
		config.set({
			year: year,
			make: make,
			model:model,
			sub_model:submodel,
			dynamic_config:[]
		});
		lookupView = new LookupView({
			model: config
		});
	});

	app.router.on('route:preload_config',function(year,make,model,submodel, config_types, config_values){

		var dyn_types = config_types.split(','),
			dyn_values = config_values.split(','),
			dyn = [];

		for (var i = dyn_types.length - 1; i >= 0; i--) {
			var typ = dyn_types[i],
				val = dyn_values[i];

			dyn.push({key:typ,val:val});
		}


		partView = new PartResultsView({
			model: part_results
		});
		config.set({
			year: year,
			make: make,
			model:model,
			sub_model:submodel,
			dynamic_config:dyn
		});
		lookupView = new LookupView({
			model: config
		});

		
	});

	_.extend(part_results, Backbone.Events);

	part_results.on('change:categories',function(){
		partView.render();
	});

	// Trigger the initial route and enable HTML5 History API support, set the
	// root folder to '/' by default.  Change in app.js.
	Backbone.history.start({
		pushState: false,
		root: app.root
	});
});