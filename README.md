# Running locally
## Installation
All files for the CollegeFinder Data Service are located in data-service.
All files for the CollegeFinder Front End are located in front-end.

./data-service $ npm install
./front-end $ npm install

Running this command creates a node_modules/ directory with all dependent modules available.
After doing this you can build the source code and run the application.

## Build files

./data-service $ npm run build
./front-end $ npm run build

Source code resides in the src/ directory and is written in TypeScript and files end with .ts.
After building a dist/ directory is created with javascript files which can be used to run the installation.

## Run installation

./data-service $ npm start
./front-end $ npm start

You can now open a browser and point it to http://localhost/
By default the backend data service is available via port 3000.

# Running in Docker

## Requirements

Minimum: 
 - Windows 10 Professional (Hyper-V Enabled)
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