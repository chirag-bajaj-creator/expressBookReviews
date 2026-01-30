const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// ^ Username is Already present in the users array
// let username= req.params.username;
let username_valid=users.filter(user=>user.username===username);
if(username_valid.length>0){
  return true;
}
else {
  return false;
}
}
// * WHY FORGET THE FILTER FUNCTION IT IS VERY USEFUL IN MANY CASES //
const authenticatedUser = (username,password)=>{ 
  // ? USERNAME AND PASSWORD IS ALREADY DEFINED IN THE PARAMS SO NEED TO REDFINE IT
  let validuser=users.filter(user=>(user.username===username && user.password===password));
  if(validuser.length>0){
    return true;
  }
  else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;
  
 
  // * Required For Validation for the username and password //
  if(!username || !password){
    return res.status(404).json({message:'username and password are required.'});
  }
  // & MAIN LOGIC FOR THE AUTHENTICATION OF THE USER //
  if(authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      data:password,
    },'access',{expiresIn: 60*60});
    req.session.authorization={
      accessToken,username
    }
    return res.status(200).json({"message": "Login Successful Hurray!"});
  }
  // ^ IT IS FALLBACK IF THE USER IS NOT AUTHENTICATED //
 
 
});

// ! ADD BOOK REVIEW BASED ON ISBN NUMBER // ^ Port Sequence FIRST AUTHOR THEN REVIEW THEN ISBN//
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn=req.params.isbn;
  let review=req.query.review;
  let username=req.session.authorization.username;
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }
  if(!review){
    return res.status(404).json({message: "Review content is required"});
  }
  if(!username){
    return res.status(404).json({message:'user not logged in'});
  }
  // * ADDING OR UPDATING THE REVIEW //
  books[isbn].reviews[username] = review;
  return res.status(200).json({"message": "Review added/updated successfully."});
});
regd_users.delete("/auth/review/:isbn",(req,res)=>{
  let isbn=req.params.isbn;
  let username=req.session.authorization.username;
  // let review=books[isbn].reviews;
 
  if(!username){
    return res.status(404).json({"message": "User not logged in"});
  }
  if(!books[isbn]){
    return res.status(404).json({"message": "Book not found"});
  }
  if(!books[isbn].reviews[username]){
    return res.status(404).json({"message": "Review by user not found"});
  }
    delete books[isbn].reviews[username];
    return res.status(200).json({"message": "Review deleted successfully."});
  
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
