# Running locally
## Data Service
### Installation
All files for the CollegeFinder Data Service are located in data-service.

$ npm install

Running this command created a node_modules/ directory with all dependent modules available.
After doing this you can build the source code or run the tests.

### Build files

$ npm run build

Source code resides in the src/ directory and is written in TypeScript and files end with .ts.
After building a dist/ directory is created with javascript files which can be used to run the installation.

### Run installation

$ npm start

You can now open a browser and point it to http://localhost:3000/

### Run unit tests

$ npm test

Tests are located in the test/ directory and typically end with .test.ts

## Front End application
### Installation, building and running
All files for the CollegeFinder front end app are located in front-end.
The installation process is similar to the Data Service, but the application is hosted on port 80.

# Running in Docker

## Requirements

Minimum: 
 - Windows 10 Professional (Hyper-V Enabled)
 - Docker v17.09.0 Community Edition

## Installation

Set Docker to swarm mode to enable secrets
$ docker swarm init

Create the required secrets
$ echo "<College Scorecard API Key>" | docker secret create collegescorecard_api_key -

Building the image
$ docker-compose build

Start the services
$ docker-compose up

Start the services in debug mode
$ docker-compose -f docker-compose.yml -f docker-compose.debug.yml up

## Run installation

Example service call
  http://localhost:3000/find/by-state/Michigan
Open chat conversation
  http://localhost/
