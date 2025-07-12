const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;
  if (!username || !password) {
    if (!username) res.send("Username is missing");
    if (!password) res.send("Password is missing");
  } else if (users.find(user => user["username"] === username)) {
    res.send("The same user has already been registered");
  } else {
    users.push({ username, password });
    console.log(`users: ${JSON.stringify(users)}`);
    res.send("User has been successfully registered");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  
  // res.send(JSON.stringify(books));

  // change to use Promise
  const promise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books));
  });

  promise.then(
    data => res.send(data)
  );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  // return res.status(300).json({message: "Yet to be implemented"});
  // const isbn = req.params.isbn;
  // const matchedBook = books[isbn];
  // res.send(matchedBook);

  // change to use Promise
  const promise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const matchedBook = books[isbn];
    console.log(`isbn: ${isbn}, matchedBook: ${JSON.stringify(matchedBook)}`);
    if (matchedBook) {
      console.log(`if, matchedBook: ${matchedBook}`);
      resolve(matchedBook);
    } else {
      console.log(`else, matchedBook: ${matchedBook}`);
      reject(new Error('no book is found with this ISBN'));
    }
  });

  promise
    .then(data => {
      console.log(`data: ${JSON.stringify(data)}`);
      res.send(data)
    })
    .catch(error => {
      console.log(`error: ${error.message}`);
      res.status(404).send(`error: ${error.message}`);
    });
 });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   // return res.status(300).json({message: "Yet to be implemented"});
//   const author = req.params.author;
//   const matchedBooks = Object.keys(books)
//     .filter(isbn => books[isbn]["author"] === author)
//     .map(isbn => {
//       const matchedBook = { isbn, ...books[isbn] };
//       console.log(`matchedBook: ${JSON.stringify(matchedBook)}`);
//       return matchedBook;
//     });
//   if (matchedBooks) {
//     res.send(JSON.stringify(matchedBooks));
//   } else {
//     res.send('no book is found with this author');
//   }
// });

// Get book details based on author (using Promise, async, await)
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const promise = new Promise((resolve, reject) => {
    const author = req.params.author;
    const matchedBooks = Object.keys(books)
      .filter(isbn => books[isbn]["author"] === author)
      .map(isbn => {
        const matchedBook = { isbn, ...books[isbn] };
        console.log(`matchedBook: ${JSON.stringify(matchedBook)}`);
        return matchedBook;
      });
    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject(new Error('no book is found with this author'));
    }
  });

  try {
    const data = await promise;
    console.log(`data: ${JSON.stringify(data)}`);
    res.status(200).send(data);
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(404).send({error: error.message});
  }
});

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   // return res.status(300).json({message: "Yet to be implemented"});
//   const title = req.params.title;
//   const matchedBooks = Object.keys(books)
//     .filter(isbn => books[isbn]["title"] === title)
//     .map(isbn => ({ isbn, ...books[isbn] }));
//   if (matchedBooks) {
//     res.send(JSON.stringify(matchedBooks));
//   } else {
//     res.send('no book is found with this title');
//   }
// });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const promise = new Promise((resolve, reject) => {
  const title = req.params.title;
  const matchedBooks = Object.keys(books)
    .filter(isbn => books[isbn]["title"] === title)
    .map(isbn => ({ isbn, ...books[isbn] }));
    if (matchedBooks.length > 0) {
      console.log(`matchedBooks: ${JSON.stringify(matchedBooks)}`);
      resolve(JSON.stringify(matchedBooks));
    } else {
      reject(new Error('no book is found with this title'));
    }
  });

  try {
    const data = await promise;
    console.log(`data: ${JSON.stringify(data)}`);
    res.status(200).send(data);
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(404).send({error: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const matchedBook = books[isbn];
  console.log(`isbn: ${isbn}, matchedBook: ${JSON.stringify(matchedBook)}`);
  const review = matchedBook["review"];
  if (review) {
    res.send(review);
  } else {
    res.send(`There is no review for this book (${books[isbn]["title"]}) yet`);
  }
});

module.exports.general = public_users;
