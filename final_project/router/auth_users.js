const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter(user => user["username"] === username && user["password"] === password);
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: 'Missing username or password.' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(404).json({ message: 'Invalid login.  Check username and password.'});
  }

  const accessToken = jwt.sign(
    { data: password },
    'access',
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = { accessToken, username };

  res.status(200).send('User successfully logged in');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const review = req.body.review;
  const { username } = req.session.authorization;
  // if user has an existing review, update the review
  // reviews = 
  //    { reviews: 
  //      [
  //        {"username": "James Bond", "review": "James' review"},
  //        {"username": "Jane Bond", "review": "Jane's review"},
  //      ]
  //    }
  let reviews = books[isbn]["reviews"];
  if (Object.keys(reviews).length == 0) { // there is no review yet, so initialize it with an empty review array
    reviews["reviews"] = [];
  }
  reviews = reviews["reviews"]; // go down one layer further, this is the empty array
  const hasNoReview = reviews.length == 0 || reviews.filter(review => review["username"] === username).length == 0;
  if (hasNoReview) { // if users does not have a review yet, append the review
    reviews.push({ "username": username, "review": review });
    res.send("Review has been created");
  } else { // if users has an existing review, update it with the new review
    reviews = reviews.map(rev => {
      if (rev["username"] === username) {
        rev["review"] = review;
      }
      return rev;
    });
    res.send("Review has been updated");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  books[isbn]["reviews"] = {}; // delete review for this book
  res.send("Review has been deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
