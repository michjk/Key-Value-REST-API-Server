# Key-Value-REST-API-Server
This is REST API server for retrieving, inserting, and updating key-value based data. The REST API specification of the project is specified in [this GitHub Gist](https://gist.github.com/jerelim/3e883999e8d8ef5af2428b364858afc3).

## Prerequisite Specification
This application is written in javascript and run in NodeJS engine. For database, MongoDB is used as NoSQL database since it is easy for a key-value pair JSON format data. For package management, I use yarn instead of npm since yarn is more efficient in downloading and installing dependencies.

## Environment Variable
Good application for production need to utilize environment varible for portability and testing. Several environment variable that need to be defined:
1. PORT: port number of NodeJS application
2. NODE_ENV: whether the application is in 'production' or 'test'. Use 'production' if the application is deployed to cloud services.
3. MONGODB_URI: URI for establishing connection to MongoDB.
4. LIBRATO_USER: username of Librato (cloud metrics analytics service).
5. LIBRATO_TOKEN: token of Librato (cloud metrics analytics service).

## Running application
Given the prerequisites is installed, we can run the application by command:
```
yarn start # or npm start
```
The command basically a subtitution for
```
node server.js
```
Where server.js contains code for preparing ExpressJS REST API and some other external services such as MongoDB.

## Testing application
The application is tested by emulating GET/POST request to ExpressJS application and check the responses and the existence of data in MongoDB. The testing is done automatically by usng Jest testing framework. To run test:
```
yarn test # or npm test
```
The testing implementation is under tests directory.

## Deployment Specification
The NodeJS application run in Heroku cloud service that provide easy way to deploy and manage application. To encourage good practice in deployment, Heroku is integrated with my Github repository and Travis CI for running test. The workflow of deployment is shown in this picture.
![screenshot from 2018-06-04 00-17-55](https://user-images.githubusercontent.com/11803421/40888671-334b2352-678d-11e8-8862-b9770588c6d9.png)
*Image from Travis CI homepage*

## Logging
Since it is not recommended to SSH connect to application instance for retrieving logs, I use PaperTrail as heroku add-ons for streaming log message to webapp based GUI.
![screenshot from 2018-06-04 00-45-53](https://user-images.githubusercontent.com/11803421/40888899-a9c6d492-6790-11e8-8bc8-ba2e4323ca43.png)

## Metrics Monitoring
To monitor number of request coming and other metrics, Librato is used as cloud service for streaming metrics from application to webapp based GUI.
![screenshot from 2018-06-04 00-53-26](https://user-images.githubusercontent.com/11803421/40888960-bca26904-6791-11e8-98f2-60da88999a66.png)
