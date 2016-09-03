I have build these APIS on Hapi.js restful framework of node.

Programming: Javascript
Database: MongoDB

Prerequisit:

Node/npm must be installed on the system. Please install Versions of node and npm given below:

v4.4.5 for node
2.15.5 for npm

How To Run this app:

=======>  Go to Project Directory "toppr Aman Kaushal" on terminal

=======>  Enter Command "npm install".

=======>  Enter command  "node server.js"  or  "npm start" to Start server

=======>  Server link will be generated and shown on terminal. Run this url on browser.

========>  Port for server changes as you restart server because server port is fetched from local system's process environment.

=======>  I have used Swagger For API Documentation.

Link is http://0.0.0.0:PORT/documentation

APIS:

First Use 'POST APIS' THEN ONLY USE 'GET APIS'.

POST /api/v1/toppr/importCsvIntoDb  <====== This API is used for store data in mongoDB

POST /api/v1/toppr/getJSONFromCSV   <====== This API is used for get JSON form data from CSV

GET /api/toppr/count  <=======  Get Count of Total Data

GET /api/toppr/list   <======  List All distict Places for Battles

GET GET /api/toppr/search  <===== Search Data based On Different Parameters

Database is host on localhost:  DB_NAME:  'toppr', COLLECTION:  'battle'

Create them on your site.


APP is Deployed on Heroku Server:

Link:  salty-shore-80156.herokuapp.com

githubLink:  https://github.com/kaushalaman/backend-Apis

Documentation is also given in this site but I could not deploy mongo db on heroku because it was requsting
to insert credit card details. Mlabs, mongo compose are used on heroku for mongo deployment but to use free service
We have to put credit card details that I haven't.

