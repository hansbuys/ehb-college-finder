# Pre-requirements
## IBM Watson
This service utilizes natural language processing to recognize the intent of a user and formulates an appropriate response.  
  
An IBM Watson Conversation workspace is required.  
Such a workspace can be created at https://www.ibm.com/watson/services/conversation/  
  
The workspace id, username and password created there should be placed in a (new) .env file based on the .env.example file in the front-end folder.  

### Workspace Configuration
#### Intents
'#find-by-state' contains examples of sentences used to describe a query for finding schools in a certain state or location.  
'#help" contains examples of sentences used to ask for help.  

#### Entities
'@us-states' contains a list of all supported locations. In this case US states.  

#### Dialog
'Welcome' is the default opening statement used to initiate the conversation.  
'Help' uses the '#help' intent to allow asking for help.  
'Find colleges' uses the '#find-by-state' intent to find schools.  
'Anything else' is the default when Watson does not recognize the request.

## College Scorecard
This API produces information required to find schools by certain static criteria (location, name, ...).  
  
An API key needs to be created before it can be used in this application. This can be created at https://api.data.gov/signup/  
  
Place the API Key in a (new) .env file based on the existing .env.example file in the data-service folder.  

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

## Logs
### Kibana

Kibana is available at http://localhost:5601.  
./logging/kibana/exports/objects.json contains all objects used by Kibana,  
including a dashboard. The dashboard can be used for additional insights,  
reducing the need for debugging.