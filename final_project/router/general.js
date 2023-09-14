const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const isbnNumber = parseInt(isbn)
    if (books[isbnNumber]) {
      resolve(books[isbnNumber])
    } else {
      reject({ status: 404, message: `ISBN '${isbn}' not found` })
    }
  })
}



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message:"User successfully registered."});
    }else{
      return res.status(404).json({message:"Username already exists"})
    }
  }
  return res.status(404).json({message: "User credentials invalid"});
});

function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books)
  })
}


// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const books = await getBooks();
    res.send(JSON.stringify({books},null,4));
  }catch(error){
    res.status(500).send(`error`);
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  /*return res.status(200).send(books[isbn]);*/
  getBookByISBN(isbn)
    .then(result => res.send(result))
    .catch((error) => res.status(error.status).json({ message: error.message }))
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  /*let req_books = [];
  for(let i=1;i<10;i++){
    if(books[i].author === author){
      req_books.push(books[i])
    }
  }
  return res.status(200).send(JSON.stringify({req_books},null,4));*/
  getBooks()
    .then(rows => Object.values(rows))
    .then(books => books.filter((book) => book.author === author))
    .then(filteredBooks => res.send(filteredBooks))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  /*let req_books = [];
  for(let i=1;i<10;i++){
    if(books[i].title === title){
      req_books.push(books[i])
    }
  }
  return res.status(200).send(JSON.stringify({req_books},null,4))*/
  getBooks()
    .then(rows => Object.values(rows))
    .then(books => books.filter((book) => book.title === title))
    .then(filteredBooks => res.send(filteredBooks))
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
  
});

module.exports.general = public_users;
