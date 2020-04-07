var projectService = require('./projectService.js'); 
var swRegister = require('./swRegister.js');

window.pageEvents = { 
    loadMore: function () { 
        projectService.loadMoreFromClientStorage();
    }
}

projectService.loadMoreRequest();
