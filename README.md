# bookingSystem

NodeJs application + angularJS frontend which enable us to create easy-to-deploy booking system.

## Setup

in order to use the system you have to deploy a mysql server and import the tables from the template "template.mysql" it will create all the struct of your db.

### Running Locally

Make sure you have npm and bower installed, cd into the root directory run ```npm install``` (for the backend libraries) and ```bower install``` (for the frontend libraries)
open http://localhost:5000 to see it

### heroku deploy

this application is heroku-ready-to-deploy system :) you cant just plugit to any databae
and push it to a random heroku server and it will work!

## Structure

this code contain the frontend and the backed of this project so this is the code structure
### Backend

- handlers (files that handle user`s request) are in "handlers" and pretty much self explanatory
- index.js responsible to run the whole thing
- dbAdapter.js responsible to interact with the database.
- /common folder contain helpers to the project.

### Frontend

- /templates contain all the pre-rendered html files.
- /public contain all the js\css\img files.
- there`s two controllers files (table, login) and app.js who responsible for the api calls



## Contribute

there`s plenty of things to do, feel free to open issues, feature requests, fork the current directory and everything else :)

## Documentation

we havent documented this system yet, if you want to help and do so, you are more than welcome to help us with documentation.
