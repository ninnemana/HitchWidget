/*global $:false */
/*global Backbone:false */

'use strict';
require([
  // Application.
  'app',

  // Main Router.
  'router'
],

function(app, Router) {

  var container = $('.widget-container');
  var key = $(container).data('key');
  console.log(key);

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({ pushState: true, root: app.root });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on('click', 'a:not([data-bypass])', function(evt) {
    // Get the absolute anchor href.
    var href = $(this).attr("href");

    // If the href exists and is a hash route, run it through Backbone.
    if (href && href.indexOf("#") === 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href, true);
    }
  });


  var Lookup = Backbone.Model.extend({
    defaults: {
      year: 0,
      make: '',
      model: '',
      submodel: ''
    },
    get: function(arg1,callback){
      switch(arg1.toLowerCase()){
        case 'year':
          this.getMakes(function(makes){
            callback(makes);
          });
          break;
        case 'make':
          this.getModels(function(models){
            callback(models);
          });
          break;
        case 'model':
          this.getSubModels(function(submodels){
            callback(submodels);
          });
          break;
        default:
          this.getYears(function(years){
            callback(years);
          });
      }
    },
    getOptions: function(arg1){
      var html = '';
      switch(arg1.toLowerCase()){
        case 'year':
          this.getMakes(function(makes){
            html += html += '<option value="">- Select Make -</option>';
            for(var i = 0; i < makes.length; i++){
              html += '<option value="' + makes[i].Make + '"">' + makes[i].Make + '</option>';
            }
            $('.curt-lookup').html(html);
          });
          break;
        case 'make':
          this.getModels(function(models){
            html += html += '<option value="">- Select Model -</option>';
            for(var i = 0; i < models.length; i++){
              html += '<option value="' + models[i].Model + '"">' + models[i].Model + '</option>';
            }
            $('.curt-lookup').html(html);
          });
          break;
        case 'model':
          this.getSubModels(function(submodels){
            html += html += '<option value="">- Select SubModel -</option>';
            for(var i = 0; i < submodels.length; i++){
              html += '<option value="' + submodels[i].Submodel + '"">' + submodels[i].Submodel + '</option>';
            }
            $('.curt-lookup').html(html);
          });
          break;
        default:
          this.getYears(function(years){
            html += html += '<option value="">- Select Year -</option>';
            for(var i = 0; i < years.length; i++){
              html += '<option value="' + years[i].Year + '"">' + years[i].Year + '</option>';
            }
            $('.curt-lookup').append(html);
          });
      }
    },
    getYears: function(callback){
      $.getJSON('https://api.curtmfg.com/v3/vehicle/years',{'key':'8aee0620-412e-47fc-900a-947820ea1c1d'},function(resp){
        
        var data = resp;
        data.length = resp.length;
        var years = [];
        years = Array.prototype.slice.call(data);
        callback(years);
      });
    },
    getMakes: function(callback){
      $.getJSON('https://api.curtmfg.com/v3/vehicle/makes/' + this.defaults.year,{'key':'8aee0620-412e-47fc-900a-947820ea1c1d'},function(resp){
        
        var data = resp;
        data.length = resp.length;
        var years = [];
        years = Array.prototype.slice.call(data);
        callback(years);
      });
    },
    getModels: function(callback){
      $.getJSON('https://api.curtmfg.com/v3/vehicle/models/' + this.defaults.year + '/' + this.defaults.make,{'key':'8aee0620-412e-47fc-900a-947820ea1c1d'},function(resp){
        
        var data = resp;
        data.length = resp.length;
        var years = [];
        years = Array.prototype.slice.call(data);
        callback(years);
      });
    },
    getSubModels: function(callback){
      $.getJSON('https://api.curtmfg.com/v3/vehicle/submodels/' + this.defaults.year + '/' + this.defaults.make + '/' + this.defaults.model ,{'key':'8aee0620-412e-47fc-900a-947820ea1c1d'},function(resp){
        
        var data = resp;
        data.length = resp.length;
        var years = [];
        years = Array.prototype.slice.call(data);
        callback(years);
      });
    },
    vehicleString: function(){
      var str = '';
      if(this.defaults.year !== undefined && this.defaults.year > 0){
        str += this.defaults.year;
      }
      if(this.defaults.make !== undefined && this.defaults.make.length > 0){
        str += ' ' + this.defaults.make;
      }
      if(this.defaults.model !== undefined && this.defaults.model.length > 0){
        str += ' ' + this.defaults.model;
      }
      if(this.defaults.submodel !== undefined && this.defaults.submodel.length > 0){
        str += ' ' + this.defaults.submodel;
      }
      return str;
    },
    currentStatus: function(){
      if(this.defaults.year === undefined || this.defaults.year === 0){
        return '';
      }
      if(this.defaults.make === undefined || this.defaults.make.length === 0){
        return 'year';
      }
      if(this.defaults.model === undefined || this.defaults.model.length === 0){
        return 'make';
      }

      if(this.defaults.submodel === undefined || this.defaults.submodel.length === 0){
        return 'model';
      }
    }
  });

  var LookupView = Backbone.View.extend({
    el: $('.widget-container'),
    events: {
      'change select.curt-lookup':'stateChange'
    },
    initialize: function(){
      _.bindAll(this,'render','years','makes','models','submodels');

      this.lookup = new Lookup();
      this.render();
    },

    render: function(){
      var html = '<span class="curt-vehiclestring">' + this.model.vehicleString() + '</span>';
      html += '<select class="curt-lookup" data-state="year">';
      this.model.getOptions(this.model.currentStatus());
      html += '</select>';
      $(this.el).append(html);
    },

    stateChange: function(ev){
      var status = $(ev.currentTarget).data('state');
      switch(status.toLowerCase()){
        case 'year':
          $(ev.currentTarget).data('state','make');
          break;
        case 'make':
        $(ev.currentTarget).data('state','model');
          break;
        case 'model':
        $(ev.currentTarget).data('state','submodel');
          break;
        case 'submodel':
          $(ev.currentTarget).data('state','config');
          break;
        default:

      }
      
      console.log(this.model.defaults.indexOf($(ev.currentTarget).val()));
      if(this.model.defaults.indexOf($(ev.currentTarget).val()) !== -1){
        this.model.defaults[status] = $(ev.currentTarget).val();
        this.model.getOptions(status);
      }

      $('.curt-vehiclestring').html(this.model.vehicleString());
      
      
    }

  });
  var lookup = new Lookup();
  var lookupView = new LookupView({model:lookup});

});
