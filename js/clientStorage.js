define([], function() {
  var projectInstance = localforage.createInstance({
    name: "projects"
  });

  function addProjects(newProject) {
    return new Promise(function(resolve, reject) {
      newProject.map(function(project) {
        projectInstance
          .setItem(project.slug, project)
          .then(function() {
            resolve();
          })
          .catch(function(error) {
            console.log("Er is een error: ", error);
          });
      });
    });
  }

  function getProjects() {
    return new Promise(function (resolve,reject) {
        projectInstance.keys().then(function (keys) {
            projectInstance.getItems(keys).then(function (results) {
                var returnArray = Object.keys(results).map(function(k) {return results[k] });
                resolve(returnArray);
            }).catch(function (error) {
                console.log('Er is een error: ', error)
            })

        })
    })
}

  return {
    addProjects: addProjects,
    getProjects: getProjects
  };
});
