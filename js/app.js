var projectService = require("./projectService.js");
var swRegister = require("./swRegister.js");

// Events, refresh button so far
window.pageEvents = {
  loadMore: function() {
    projectService.loadMoreFromClientStorage();
  }
};

// Call to load all project data and tags from fetch api using promises
projectService.loadMoreRequest();
