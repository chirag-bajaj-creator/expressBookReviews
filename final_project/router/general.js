const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TODO :get  all books list using async await and axios and promises
// ^ Have to make the New function async function ^
 function getAllBooks_Async() {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
    if(books){
      resolve(books);
  }
  else{
    reject('no book found');
  }
  },100);
});
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(!username || !password){
    return res.status(400).json({message:'Username and password are required.'});
  }
  // * check if username is valid and the then push both 
    if(!isValid(username)){
    users.push({username:username,password:password});
    return res.status(200).json({message: "User registered successfully."});
  }
  else{
    return res.status(404).json({message: "User Already there."});
  }
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
  // let review=req.params.review;
  let isbn=req.params.isbn;
  if(books[isbn]){
    // let review=req.params.review;
    return res.status(200).json({
      books:books[isbn].reviews,
      message:'Book review retrieved successfully'
    });
  }
  else{
    return res.status(404).json({message: "Review not found By ISBN"});
  }
});
getAllBooks_Async().then((books)=>{
  console.log("All Books:",books);
}).catch(err=>{
 console.error('error fetching books:',err);
});

module.exports.general = public_users;
