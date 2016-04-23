/* Deps */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

/* Connect to database */
mongoose.connect("mongodb://localhost/demo-really-fun");

// npm install --save bcrypt

var minAge = 13;

var userSchema = new Schema({
  username: String,
  age: Number,
  password: String
});

/* Pre-hook: sneaks in underage Internet surfers
*  NOTE: Calling next() ensures each subsequent middleware is called */

userSchema.pre("save", function(next) {
  if (this.age < minAge) this.age = minAge;
  return next();
});

userSchema.pre("save", function(next) {
  var user = this; // note the context of this
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(4, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

var User = mongoose.model("User", userSchema);

var youngGeorge = new User({
  username: "underage.internet.surfer",
  age: 11,
  password: "my-new-password"
});

youngGeorge.save(function(err, g) {
  console.log(err);
  console.log(g);
});

/* Back to presentation */

/* One-to-one embedded relationship */

var contactSchema = new Schema({
  name: {
    first: {type: String, required: true},
    last:  {type: String, required: true}
  },
  email: {type: String, required: true, unique: true},
  address: {
    street: {type: String, required: true},
    city:   {type: String},
    state:  {type: String},
    zip:    {type: String},
  }
});

var Contact = mongoose.model("Contact", contactSchema);

var jimBob = new Contact({
  name: {
    first: "Jim",
    last: "Bob"
  },
  email: "jim.bob@email.com",
  address: {
    street: "159 W 100 S"
  }
});

/* One-to-many Embedded */
 
var personSchema = new Schema({
  name: String,
  rolodex: [{
    name: {
      first: {type: String, required: true},
      last:  {type: String, required: true}
    },
    email: {type: String, required: true, unique: true},
    address: {
      street: {type: String, required: true},
      city:   {type: String},
      state:  {type: String},
      zip:    {type: String},
    }
  }]
});

var Person = mongoose.model("Person", personSchema);

var rick = new Person({
  name: "Rick Roll",
  rolodex: [
    {
      name: {
        first: "Jim",
        last: "Bob",
      },
      email: "jim.bob@email.com",
      address: {
        street: "159 W 100 S"
      }
    },
    {
      name: {
        first: "Deidra",
        last: "McCloskey",
      },
      email: "deidra@email.com",
      address: {
        street: "900 S. Main"
      }
    }
  ]
});

/* Add another for query demo */

var sarah = new Person({
  name: "Sarah Jane",
  rolodex: [
    {
      name: {
        first: "Pinky",
        last: "Octane",
      },
      email: "pinky@email.com",
      address: {
        street: "909 E. Center"
      }
    }
  ]
});

/* Query on embedded documents */

Person.find({"rolodex.email": "pinky@email.com"}, function(err, resp) {
  console.log(resp);
});

Person.find({"rolodex.name.first": "Deidra"}, function(err, resp) {
  console.log(resp);
});

/* Additional subdocument queries
 * http://mongoosejs.com/docs/subdocs.html
 */

/* Illustrates how schemas are decoupled (not linked) to models */

var contactSchema = new Schema({
  name: {
    first: {type: String, required: true},
    last:  {type: String, required: true}
  },
  email: {type: String, required: true, unique: true},
  address: {
    street: {type: String, required: true},
    city:   {type: String},
    state:  {type: String},
    zip:    {type: String},
  }
});

var personSchema = new Schema({
  name: String,
  rolodex: [contactSchema]
});

var Person2 = mongoose.model("Person2", personSchema);

var sarah = Person({
  name: "Sarah Jane",
  rolodex: [
    {
      name: {
        first: "Pinky",
        last: "Octane",
      },
      email: "pinky@email.com",
      address: {
        street: "909 E. Center"
      }
    }
  ]
});

/* One-to-many reference relationship */

var authorSchema = Schema({
  name: String,
  age: Number
});

var bookSchema = Schema({
  creator: {type: String, ref: "Author", required: true},
  title: String,
});

var Author = mongoose.model("Author", authorSchema);
var Book = mongoose.model("Book", bookSchema);

/* Create an author and a book */

var aaron = new Author({name: 'Aaron', age: 100});

aaron.save(function(err, author) {
  var book1 = new Book({
    title: "Once Upon a Timex",
    creator: author._id
  });
  book1.save(function(err, b) {
    console.log(b);
  });
});

/* Population
 * http://mongoosejs.com/docs/populate.html
 */

Book.
  find().
  populate("creator").
  exec(function(err, books) {
  console.log(books);
});

/* Only the name of the author */

Book.
  find().
  populate("creator", "name").
  exec(function(err, books) {
  console.log(books);
});

Project
  .findOne({projectName: req.query.projectName})
  .populate({
    path: 'contributors',
    match:{email: req.query.email},
    select: 'name',
    options: {limit: 5}
  })
  .exec(function(err, project) {
    console.log(project);
  });
       
User.remove();
Contact.remove();
Person.remove();
Person2.remove();
Author.remove();
Book.remove();
