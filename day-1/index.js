/* Require lib */

var mongojs = require("mongojs");

/* Create a database connection */
 
var db = mongojs("fun-1"); // increment db name for new clasj

/* Our JS data */

var users = [
  {
    username: "judge.judy",
    first_name: "Judge",
    last_name: "Judy",
    age: 89
  },
  {
    username: "phil.donahue",
    first_name: "Phil",
    last_name: "Donahue",
    age: 34
  },
];

/* Create reference to a users collection. */

var collection = db.collection('users');

/* Create a document in the users collection */

collection.insert(users, function(err, users) {
  console.log(users);
});

/* Find ALL users in the collection */

collection.find(function(err, users) {
  console.log(err);
  console.log(users[0]);
});
 
/* NOTE:
 *  1: `find` method
 *  2: callback function
 *  3: err argument
 *  4: users argument returns an Array
 */

collection.find({username: "phil.donahue"}, function(err, users) {
  console.log(users);
});

/* Query using MongoDB operators:
 * https://docs.mongodb.org/manual/reference/operator/query/
 */

collection.find({age: {$lt: 50}}, function(err, users) {
  console.log(users);
});

/* Query a list of usernames */

collection.find({username: {$in: ["judge.judy", "phil.donahue"]}}, function(err, users) {
  console.log(users);
});

/* Sort users by username in descending order */

collection.find().sort({age: -1}, function(err, users) {
  console.log(users);
});

/* Retrieve a single document by id as a JS object */

var ObjectId = mongojs.ObjectId;

collection.findOne({_id: ObjectId("56ddc079707622b55ce7d17a")}, function(err, user) {
  console.log(user);
});

/* Update a document */

collection.update({_id: ObjectId("56ddc079707622b55ce7d17a")}, {$set: {last_name: "Jury"}}, function(err, resp) {
  console.log(resp);
});

/* Note response from Mongo */

/* MORE
 * https://github.com/mafintosh/mongojs
 */
