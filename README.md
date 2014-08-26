MEEN Starter Kit
================

(Version 0.3.2)

A starter kit for creating web applications using MongoDB, Ember.js, Express and Node.js.

The starter kit implements a simple to-do list, saving items to a MongoDB collection. Grunt is used to build the app. (This may be changed to Gulp at some point.)

Pre-requisites
--------------

Ensure Node.js and MongoDB are already installed. Stylesheets are written in Sass, so you'll need Ruby and Compass too. Refer to the documentation for each for installation instructions.

The application uses Grunt to build the application. Install Grunt using npm with the following command.

```
$ npm install -g grunt-cli
```

After checking out the application, run the following command in the application folder (./app) to install required Node.js dependencies:

```
$ npm install
```

How to run
----------

You can start a MongoDB instance using the batch file or shell script in the mongo-data folder.

Run the following command in the application folder to build the application to the 'dist' folder and start the application.

```
$ grunt
```

By default, the starter app listens on port 8000. This can be changed using the config files in the ./app/config folder. 

Building for production
-----------------------

Run the following command to build the app for production. The output can be found in the 'dist' folder.

```
$ grunt prod
```

The production build will use minified versions of the jQuery, Ember and Handlebars libraries, and use the production config found in the ./app/server/config/prod.js file.

Alternatively, use this command to build the app for production and package it as a zip file. This is useful if you want to deploy the app to a server automatically, e.g. using a fabfile:

```
$ grunt package
```

Folder structure
----------------
<pre>
+-- README.md - this file
+-- mongo-data
|   +-- start mongodb.bat - Windows batch file
|   +-- start mongodb.sh - start MongoDB (Bash shell script)
|
+-- app - starter kit code
    +-- server - Node.js back-end application code
    |   +-- config - set application port and MongoDB URL here
    |   +-- constants - set global constant variables here
    |   +-- controllers - back-end (web service) logic goes here
    |   +-- routes - set routes for Express here
    |   +-- server.js - The entry point for the entire application
    |
    +-- web - Ember.js application code and resources
    |   +-- fonts - web fonts
    |   +-- images - images used in the app
    |   +-- libs - libraries for jQuery, Handlebars and Ember.js
    |   +-- scripts
    |   |   +-- app - Ember.js application logic
    |   |   +-- modules - put app logic here; create a subfolder for each 
    |   |                   module to hold relevant routes, views and controllers
    |   |
    |   +-- stylesheets - SASS stylesheets
    |   +-- templates - Handlebars templates
    |   +-- tests
    |   |   +-- specs - put Jasmine unit tests here to test app logic. BDD is encouraged!
    |   |   +-- vendor - libs for Ember-Jasmine. Replace with Ember-QUnit if preferred.
    |   |
    |   +-- index.html 
    |
    +--- Gruntfile.js - Grunt configuration; will build the app to the 'dist' folder
</pre>