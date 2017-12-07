# Running in Docker
## Requirements

Minimum: 
 - Windows 10 Professional (Hyper-V Enabled) or other Docker enabled OS.
 - Docker v17.09.0 Community Edition

## Installation

Building the image  
$ docker-compose build  
  
Start the services  
$ docker-compose up  
  
Start the services in debug mode  
$ docker-compose -f docker-compose.yml -f docker-compose.debug.yml up  

## Run installation

Example data service call  
  http://localhost:3000/find/by-state/Michigan  
Open chat conversation  
  http://localhost/  
  
## Debugging
### Data Service
Attach a debugger for NodeJS to port 9229.  
You can use for example Chrome NodeJS tools (at chrome://inspect).  

### Front End
Identical to debugging for the Data Service but instead connect to port 9230.  

# Code origins
./front-end/public & ./front-end/readme_images are created by IBM.  
./front-end/src/ was initially started by the same IBM application,  
it has since been modified to support this project.  
IBM Chat application source: https://github.com/watson-developer-cloud/conversation-simple