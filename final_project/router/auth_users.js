const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();

let users = []



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
for(let i=0;i<users.length;i++){
  if(users[i].username === username){
    return true;
  }
}
return false;

}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  for(let i=0;i<users.length;i++){
    if(users[i].username === username && users[i].password === password){
      return true;
    }
  }
  return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    res.status(404).json({message:"Error logging in"});
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access',{expiresIn: 60 * 60});

    req.session.authorization = {
    accessToken,username
    }
    return res.status(200).send("User logged in successfully");
  }
  return res.status(208).json({message: "Invalid credentials"});


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if(books[isbn]){
    books[isbn].review[username] = review;
    return res.status(200).json({
      message:`Review added for ISBN ${isbn}.`
    })
  }


  return res.status(404).json({message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if(books[isbn]){
    delete books[isbn].reviews[username]
    return res.status(200).send(`Review for book with ISBN ${isbn} has been deleted`)
  }
  return res.status(404).json({message:"Book has not been found."})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
