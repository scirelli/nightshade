# Cogito, Node.js #
 
Beginnings of planner web application in Node.js

### Application Stack ######

- [Node.js](http://www.nodejs.org)

- [Express](http://www.expressjs.com/)

- [Jade](http://jade-lang.com/)

- [MongoDB](http://www.mongodb.org/)

- [Mongoose](http://mongoosejs.com/)

### Node Dependencies ######

    cd server
    npm install

### Start MongoDB server ######

    # launch mongodb daemon
    mongod

    # test by connecting locally
    mongo

    Application creates a db named cogito with a `users` collection.

### Start Node server ######

    # in server/
    node server.js