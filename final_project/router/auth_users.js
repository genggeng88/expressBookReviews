const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Empty username or password!"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {accessToken, username};
    return res.status(200).send("User successfully logged in");

  } else {
    return res.status(208).json({ message: "Invalid login. Check username and password."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found!"});
  }

  if (!review || !username) {
    return res.status(404).json({message: `Empty review or username!`});
  }

  books[isbn].reviews[username] = review;
  res.json({ message: "Review added/modified successfully." });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found!"});
  }

  if (!books[isbn].reviews) {
    return res.status(404).json({ message: "No reviews found for this book!" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(403).json({ message: "You can only delete your own reviews!" });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  res.json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
