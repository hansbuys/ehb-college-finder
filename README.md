# Running locally
## Installation

$ npm install

Running this command created a node_modules/ directory with all dependent modules available.
After doing this you can build the source code or run the tests.

## Build files

$ npm run build

Source code resides in the src/ directory and is written in TypeScript and files end with .ts.
After building a dist/ directory is created with javascript files which can be used to run the installation.

## Run installation

$ npm start

You can now open a browser and point it to http://localhost:3000/

## Run unit tests

$ npm test

Tests are located in the test/ directory and typically end with .test.ts

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
$ docker build -t hansb/collegefinder .

Deploy as a service
$ docker stack deploy --compose-file=docker-compose.yml <service_name>
Debug mode
$ docker stack deploy --compose-file=docker-compose.yml --compose-file=docker-compose.debug.yml <service_name>

## Run installation

Example call
  http://localhost:3000/find/by-state/Michigan