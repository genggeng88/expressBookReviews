const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login."});
    } else {
      return res.status(404).json({message: "Username already exists!"});
    }
  }
  return res.status(404).json({message: "Empty username or password!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found for this ISBN." });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;

  const result = Object.values(books).filter(book => book.author === author);

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({messge: "No book found for this author."})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title === title);

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({message: "No book found for this title."});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(`The review for book with ibsn ${isbn} is: ${books[isbn].review}`);
  } else {
    res.status(404).json({ message: "Book not found for this ISBN." });
  }
});

// Function to get the list of books using async/await
async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('Books List:', response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Book Details for ISBN ${isbn}:`, response.data);
  } catch (error) {
    console.error(`Error fetching book details for ISBN ${isbn}:`, error);
  }
}


async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Books by ${author}:`, response.data);
  } catch (error) {
    console.error(`Error fetching books by ${author}:`, error);
  }
}


async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Books with title "${title}":`, response.data);
  } catch (error) {
    console.error(`Error fetching books with title "${title}":`, error);
  }
}

// Call the function
// getBooks();
// getBookByISBN(1);
// getBooksByAuthor('Chinua Achebe');
// getBooksByTitle('Things Fall Apart');

module.exports.general = public_users;
