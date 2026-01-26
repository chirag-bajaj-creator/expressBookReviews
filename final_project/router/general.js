const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({
    books:books,
    message: "all books retrieved"
  });
});
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;
  let isbn_extrcat=books[isbn];
  if(!isbn_extrcat){
    return res.status(404).json({message: "ISBN not found"});
  }
  else{
  return res.status(200).json({
    books:isbn_extrcat,
    message: "isbn extracted successfully"
  });
}

 });
  
// & THE GET BOOKS BASED ON AUTHOR & //
public_users.get('/author/:author',function (req, res) {
  //Write your code here
// * THIS IS THE SIMPLE CODE FOR THE AUTHOR SEARCH BUT IT WILL NOT WORK AS EXPECTED AS WE NEED TO LOOP THROUGH THE BOOKS OBJECT TO FIND THE AUTHOR *
// TODO: To search the books by converting author name to the lowercase 
let author=req.params.author.toLowerCase();
const result=Object.values(books).filter(books=>books.author.toLowerCase()===author);
if(result.length>0){
  return res.status(200).json({
    message:'books Details by author found successfully',
    books:result
   
});
}
else{
  return res.status(404).json({'message':'No Book Found By The Author Name',
  books:[]
});
}

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title=req.params.title.toLowerCase();
  const result_title=Object.values(books).filter(books=>books.title.toLowerCase()===title);
  if(result_title.length>0){
    return res.status(200).json({
      books:result_title,
      message:'Books details by title found successfully'
    });
  }
   else{
    return res.status(404).json({
      message:'No Books Found by Title',
      books:[]
    });
   }
  });



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
