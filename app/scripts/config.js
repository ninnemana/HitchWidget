// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs: "http://labs.curtmfg.com/widget_v3/scripts/libs",
    plugins: "http://labs.curtmfg.com/widget_v3/scripts/plugins",

    // Libraries.
    jquery: "http://labs.curtmfg.com/widget_v3/scripts/libs/jquery",
    lodash: "http://labs.curtmfg.com/widget_v3/scripts/libs/lodash",
    backbone: "http://labs.curtmfg.com/widget_v3/scripts/libs/backbone"
  },

  shim: {
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },

    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"]
  }

});
