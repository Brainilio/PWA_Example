define(["./template.js", "./clientStorage.js"], function(
  template,
  clientStorage
) {
  let apiUrlPath = "https://cmgt.hr.nl:8000/api/projects/";
  let apiTagsUrl = "https://cmgt.hr.nl:8000/api/projects/tags/";

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
