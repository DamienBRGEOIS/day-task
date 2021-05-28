# daytask : A simple Trello clone 

## What is daytask ?

**daytask** is a single page application that replicate basic [trello](https://trello.com/) [features](#features). It is composed of two projects :

### The back end (location)

The back end is a REST API made with [Node JS](https://nodejs.org/) and [Express](https://expressjs.com/) which is linked to a MongoDB database.

The communication between the API and the database is handled by [Mongoose](https://mongoosejs.com/).

This REST API is divided in 3 services :

- **AuthService** : Authenticate users using a [Json Web Token](https://jwt.io/)
- **BoardService** : Manage boards
- **InviteService** : Manage invitation to boards

### The front end 

The front end is a single page application made in HTML5, CSS3 and Javascript using [Vue JS](https://vuejs.org/) framework. 

The application uses [Vue X](https://vuex.vuejs.org/) to share states between pages and [Vue Router](https://router.vuejs.org/) to handle the front end routing.

The front end also uses [SASS](https://sass-lang.com/) preprocessor in order to create more maintainable styles for the user interface.



------

*Please note that the current version of daytask is just a **minimal viable product** created by Damien BOURGEOIS in **8 days**.*

*Some **features will be added in the future** and **improvements will be made** to make the project **more maintainable** and **more efficient**.* 

------



## Features



### Manage your boards

![board-crud99354acec70ff359.gif](https://s3.gifyu.com/images/board-crud99354acec70ff359.gif)



### Invite other users on your boards

![board-create-invite7f0746ab86d26f27.gif](https://s3.gifyu.com/images/board-create-invite7f0746ab86d26f27.gif)


### Accept board invitation from an invite link

![board-accept-invite7b0de6ed841525a2.gif](https://s3.gifyu.com/images/board-accept-invite7b0de6ed841525a2.gif)

### Manage columns inside a Board

![column-crudd8aff6b0a480c8cb.gif](https://s3.gifyu.com/images/column-crudd8aff6b0a480c8cb.gif)

![column-reorder2e8406c5faf0b092.gif](https://s3.gifyu.com/images/column-reorder2e8406c5faf0b092.gif)



### Manage tasks inside a Board

![task-crud1246f829e54c1934.gif](https://s3.gifyu.com/images/task-crud1246f829e54c1934.gif)

![task-move840498dbf1f90073.gif](https://s3.gifyu.com/images/task-move840498dbf1f90073.gif)



## Requirements

In order to run this application you will need to have the following programs installed on your machine :

- **Node JS** 
- **MongoDB**
- **Yarn or NPM**



## Configuration

In **/api/config** add two files :

- **production.json** 
- **development.json** 

Those files should contain the following keys :

```json
{
  "connectionString": "YOUR_MONGO_DB_CONNECTION_STRING",
  "JWT_SECRET": "THE_SECRET_OF_YOUR_CHOICE_TO_SIGN_TOKENS"
}
```



## Initialize project

In order to download the project dependencies, in both **/app** and **/api** folders you need to run  :

```bash
yarn install
```

or

```bash
npm install
```



## Run application

To run the front end application go in **/app** folder and run :

```bash
yarn serve
```

or

```bash
npm serve
```



To run the front end application go in **/api** folder run :

```bash
node index.js
```
