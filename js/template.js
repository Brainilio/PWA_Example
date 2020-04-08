define([], function() {
  // Generate a div to append data to it
  function generateProjectDiv(project) {
    let template = document.querySelector("#project-card").innerHTML;
    template = template.replace("{{image}}", 'https://cmgt.hr.nl:8000/' + project.headerImage)
    template = template.replace("{{title}}", project.title);
    template = template.replace("{{description}}", project.description);
    return template;
  }

  // Append data to div and allow function to create div with data in it, output it in the html
  function appendProjects(projects) {
    document.getElementById("loadingText").innerHTML = "";
    let output = "";
    projects.map(function(projects) {
      return (output += generateProjectDiv(projects));
    });

    document.querySelector("#content").insertAdjacentHTML("beforeend", output);
  }

  // Generate a tag div
  function appendTags(tags) {
    let output = "";
    tags.map(function(tag) {
      return (output += generateTagChips(tag));
    });
    document
      .querySelector("#tag-contents")
      .insertAdjacentHTML("beforeend", output);
  }

  // Add data to generated tag div
  function generateTagChips(tag) {
    let template = document.querySelector("#tag-chips").innerHTML;
    template = template.replace("{{name}}", tag);
    return template;
  }

  return {
    appendProjects: appendProjects,
    appendTags: appendTags
  };
});
