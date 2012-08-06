# node-mongo-blog

Testing ground for node.js api with mongodb. This is as simple blog site that will be extended and modified for the MyTestimony project I'm working on.


## Usage

1. install dependencies and libraries `$ npm install`
2. Fire up Mongo DB `$ mongod`
3. Run node app `$ node app.js`
4. Open browser to `http://localhost:3000` and begin viewing/creating posts


## Todo

* update use of `createHexFromString` method as it's been deprecated. Use `new ObjectID(id)` method instead
* ~~Load and test onto heroku server~~
     * ~~added Procfile~~
     * ~~added free mongohq addon of 16mb. Verified account on heroku~~
     * ~~get mongo db running~~
* Include API for another client to consume: website, mobile app
     * will return JSON
* Look into build server, continuous integration architecture to automatically run build deployment upon git push
