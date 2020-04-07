"use strict"; 

//New

let projectCacheName = 'projectCacheV1';
let projectCachePagesName = 'projectCachePagesNameV1';


let projectCacheFiles = [ 
    'js/app.js', 
    'js/projectService.js',
    'js/clientStorage.js',
    'js/swRegister.js',
    'js/template.js',
    './',
    'resources/es6-promise/es6-promise.js',
    'resources/fetch/fetch.js',
    'resources/localforage/localforage.min.js',
    'resources/localforage/localforage-getitems.js',
    'resources/localforage/localforage-setitems.js',
    'materialize/css/materialize.css',
    'materialize/css/materialize.min.css',
    'materialize/js/materialize.js',
    'materialize/js/materialize.min.js',
    'resources/systemjs/system.js',
    'resources/systemjs/system-polyfills.js'
];

let projectsPath = 'https://cmgt.hr.nl:8000/api/projects/';
let tagPath = 'https://cmgt.hr.nl:8000/api/projects/tags/'

// On install 
self.addEventListener('install', function(event){ 
 
    console.log('From SW: Install event', event)
    self.skipWaiting(); 
    event.waitUntil(
    //cache during installing phase! 
    caches.open(projectCacheName)
    .then(function(cache){ 
        return cache.addAll(projectCacheFiles);
    })
    );
});


// Activate
self.addEventListener('activate', function(event){ 
    console.log("From SW: Activate state", event)
    self.clients.claim();
    event.waitUntil(
        caches.keys()
        .then(function(cacheKey){
            let deletePromises = [];
            for(let i = 0; i < cacheKey.length; i++) { 
                if(cacheKey[i] != projectCacheName && 
                   cacheKey[i] != projectCachePagesName) { 
                deletePromises.push(caches.delete(cacheKey[i]))
                }
            }
            return Promise.all(deletePromises)
        }).catch(function(error){ 
            console.log("Er is wat misgegaan!" + error)
        })
    )
})


// Different fetch strategies
self.addEventListener('fetch', function(event){ 
  let requestUrl = new URL(event.request.url)
  let requestPath = requestUrl.pathname; 
  let fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1); 

  //network only (helpful to update UI, otherwise just make it conditional)
  if (navigator.onLine) {
    event.respondWith(fetch(event.request));
    }
    //network first cache later
    else if(requestPath == projectsPath  || fileName == 'sw.js'){
    event.respondWith(networkFirstStrategy(event.request))
    //offline results
    } else {
    console.log('Offline');
    event.respondWith(cacheFirstStrategy(event.request))

}
//   if(requestPath == tagPath || fileName == 'sw.js') { 
//         event.respondWith(fetch(event.request));
//         console.log("I'm online, fetching tags with me.")
//   }
//   else if(requestPath == projectsPath){ 
//         event.respondWith(networkFirstStrategy(event.request))
//         console.log("Network first.")
//   }
//   else { 
//         event.respondWith(cacheFirstStrategy(event.request))
//         console.log("Cache first")
//   }

});

function cacheFirstStrategy(request){ 
    return caches.match(request).then(function(cacheresponse){
        return cacheresponse || fetchNetworkandCache(request)
    })
}
function networkFirstStrategy(request){ 
    return fetchNetworkandCache(request).catch(function(request){ 
        //callback fails if fetch fails (if we're offline) 
        return caches.match(request);
    })
}

function fetchNetworkandCache(request) { 
    return fetch(request).then(function(networkResponse){ 
        caches.open(getCacheName(request)).then(function(cache){
            //put it into the cache upon connection
            cache.put(request, networkResponse);
        })
        return networkResponse.clone();
    })
}

function getCacheName(request){ 
    let requestUrl = new URL(request.url);
    let requestPath = requestUrl.pathname;

    return projectCacheName
}
