define(["./template.js", "./clientStorage.js"], function(
  template,
  clientStorage
) {
  let apiUrlPath = "https://cmgt.hr.nl:8000/api/projects/";
  let apiTagsUrl = "https://cmgt.hr.nl:8000/api/projects/tags/";


  // Here is where you will load all the data from the fetch promises to the html that will be called in app.js
  function loadMoreRequest() {
    fetchPromise()
      .then(function(status) {
        document.getElementById("connection-status").innerHTML = status;
        loadMoreFromClientStorage();
        fetchTags();
      })
      .catch(function(error) {
        console.log("Something wrong during fetching data...");
      });
  }

  // Fetch tag data, same as the project data, but if site's offline, you won't show the data at all and give a warning that you should connect 
  // to the internet AVOID GLOBAL VARIABLES
  function fetchTags() {
    if (navigator.onLine) {
      return new Promise(function(resolve, reject) {
        fetch(apiTagsUrl)
          .then(function(res) {
            return res.json();
          })
          .then(function(data) {
            template.appendTags(data.tags);
            resolve();
          })
          .then(function() {
            console.log("Tags were fetched.");
          })
          .catch(function(error) {
            console.log("Something wrong during fetching tags..." + error);
            let fail = ["Connect to internet."];
            template.appendTags(fail);
          });
      });
    } else {
      let fail = ["Connect to internet."];
      template.appendTags(fail);
    }
  }

  // Fetch data using promise, add projects to the clientstorage, if its offline it shows the catch functions
  function fetchPromise() {
    return new Promise(function(resolve, reject) {
      fetch(apiUrlPath)
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          clientStorage.addProjects(data.projects).then(function() {
            console.log("Data retrieved");
            resolve("You're connected! Showing latest results.");
          });
        })
        .catch(function(error) {
          console.log("Something wrong during fetching projects.." + error);
          resolve("No connection, showing offline results.");
        });
    });
  }

  // Load data from the clientstorage, from the clientstorage you want to append this data to the div to display
  function loadMoreFromClientStorage() {
    clientStorage.getProjects().then(function(projects) {
      template.appendProjects(projects);
    });
  }

  return {
    loadMoreRequest: loadMoreRequest,
    loadMoreFromClientStorage: loadMoreFromClientStorage
  };
});
