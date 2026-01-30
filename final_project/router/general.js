const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TODO :get  all books list using async await and axios and promises
// ^ Have to make the New function async function ^
const axios=require('axios');
// ! IT IS THE METHOD TO GET ALL BOOKS USING ASYNC PROMISE CALLBACKS
// const axios = require('axios');

async function getAllBooks_Axios() {
  try{
    const response=await axios.get('http://Localhost:5000/');
    return response.data.books;
  }
  catch(error){
    throw new Error ('error fetching all books'+error.message);
  }
  
}

// ! THE FUNCTION TO FIND THE BOOKS DETAILS BASED ON ISBN !//
async function getbooksIsbnAxios(isbn){
try{
  const response=await axios.get(`http://Localhost:5000/isbn/${isbn}`);
  if(response.data.books){
  return response.data.books;
  }

else{
  throw new Error('Book Not Found');
}
}
catch(error){
  throw new Error('error fetching book by isbn'+error.message);
}
}
// ~ TO FIND THE DETAILS OF THE {BOOKS BASED ON AUTHOR NAME USING PROMISE ASYNC//
async function getBooksByAuthor_Axios(author){
 try{
  const response=await axios.get(`http://Localhost:5000/author/${author}`);
  if(response.data.books&&response.data.books.length>0){
    return response.data.books;
  }
  else{
    throw new Error('no book found by author');
  }

 }
 catch(error){
  throw new Error('error fetching books by author'+error.message);
 }
}
// ^ Get Details of the Book Based on TITLE using PROMISE ASYNC ^ //
async function getBooksByTitle_Axios(title){
  try{
    const response=await axios.get(`http://Localhost:5000/title/${title}`);
    if(response.data.books&&response.data.books.length>0){
      return response.data.books;
    }
    else{
      throw new Error('no book found by title');
    }
  }
  catch(error){
    throw new Error('error fetching books by title'+error.message);
  }
}
public_users.post("/register", (req,res) => {

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
  return res.status(200).json({
    books:books,
    message: "all books retrieved"
  });
}); 
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
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
  let isbn=req.params.isbn;
  if(books[isbn]){
      res.status(200).json(
        {reviews:books[isbn].reviews});
  }
  else{
    return res.status(404).json({message: "Review not found By ISBN"});
  }
});
// & CALLING THE ASYNC FUNCTION TO GET ALL BOOKS & //
getAllBooks_Axios().then((books)=>{
  console.log("All Books:",JSON.stringify(books,null,2));
}).catch(error=>{
 console.error('error fetching books:',error.message);
});
// * CALLING THE ASYNC FUNCTION TO GET BOOKS BY ISBN *//
getbooksIsbnAxios("1").then((book)=>{
  console.log("Book Details by ISBN:",JSON.stringify(book,null,2));
}).catch(error=>{
 console.error('error fetching book by isbn:',error.message);
});
// ~ CALLING THE ASYNC FUNCTION TO GET BOOKS BY AUTHOR ~ //
getBooksByAuthor_Axios("Chinua Achebe".toLowerCase()).then((books)=>{
  console.log("Books by Author:",books);
}).catch(error=>{
 console.error('error fetching books by author:',error.message);
});
// ^ CALLING THE ASYNC FUNCTION TO GET BOOKS BY TITLE ^ //
getBooksByTitle_Axios("Things Fall Apart".toLowerCase()).then((books)=>{
  console.log('books by title:',books);
}).catch(error=>{
  console.error('error fetching books by title:',error.message);
});
module.exports.general = public_users;
