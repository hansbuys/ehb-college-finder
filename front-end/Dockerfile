FROM node:latest

# Preparing for buid
WORKDIR /usr/src/app
COPY ["package.json", "./"]

# Build application
RUN npm install
COPY . .
RUN npm run build

# Container setup 
EXPOSE 3000
CMD npm start