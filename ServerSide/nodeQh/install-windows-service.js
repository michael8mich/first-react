var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'qh-service',
    description: 'qh-service',
    script: 'C:\\nodeQh\\dist\\index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});

svc.install();

///Comand 
//npm install -g node-windows
//npm link node-windows
//node install-windows-service.js
//https://dev.to/petereysermans/installing-a-node-js-application-as-a-windows-service-28j7