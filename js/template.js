define([], function(){ 

    function generateProjectDiv(project) { 
        let template = document.querySelector('#project-card').innerHTML
        template = template.replace('{{title}}', project.title);
        template = template.replace('{{description}}', project.description)
        return template
    }

    function appendProjects(projects) { 

        document.getElementById("loadingText").innerHTML = ""
        let output = ''; 
        projects.map(function(projects) { 
        return output += generateProjectDiv(projects)

       })

             document.querySelector('#content').insertAdjacentHTML('beforeend', output)
        
       
       
    }

    function appendTags(tags) { 
        let output = ''
        tags.map(function(tag){ 
            return output += generateTagChips(tag)
        })
        document.querySelector('#tag-contents').insertAdjacentHTML('beforeend', output);
    }



    function generateTagChips(tag) { 
        let template = document.querySelector('#tag-chips').innerHTML
        template = template.replace('{{name}}', tag)
        return template
    }

    return { 
        appendProjects: appendProjects,
        appendTags: appendTags
     }
})