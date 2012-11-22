require([
  // Application.
  "app",

  // Main Router.
  "router"
],

function(app, Router) {

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({ pushState: true, root: app.root });

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
          });
          break;
        case 'make':
          this.getModels(function(models){
          });
          break;
        case 'model':
          this.getSubModels(function(submodels){
          });
          break;
        default:
          this.getYears(function(years){
          });
      }
    },
    getOptions: function(arg1,callback){
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
      var self = this;
      var html = '<span class="curt-vehiclestring">' + this.model.vehicleString() + '</span>';
      html += '<select class="curt-lookup">';
      this.model.getOptions(this.model.currentStatus());
      html += '</select>';
      $(this.el).append(html); 
    },

    stateChange: function(ev){
      var status = this.model.currentStatus();
      console.log('Status' + status);
      if(this.model.defaults.hasOwnProperty(status)){
        this.model.defaults[status] = $(ev.currentTarget).val();
        this.model.getOptions(status);
      }else{
        this.model.defaults.year = $(ev.currentTarget).val();
        this.model.getOptions('year');
      }
    }

  });
  var lookup = new Lookup();
  var lookupView = new LookupView({model:lookup});


  /*var ListView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click button#add': 'addItem'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem'); // remember: every function that uses 'this' as the current object should be in here
      
      this.collection = new List();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0;
      this.render();      
    },
    render: function(){

       var self = this;      
      $(this.el).append("<button id='add'>Add list item</button>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },

    addItem: function(){
      this.counter++;
      var item = new Item();
      item.set({
        part2: item.get('part2') + this.counter // modify item defaults
      });
      this.collection.add(item); // add item to collection; view is updated via event 'add'
    },

    appendItem: function(item){
      $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
    }
  });*/


  //var listView = new ListView();
  

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
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

});

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
