const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
// & To give the space in the json response //
app.set('json spaces', 4);
// ^ Middleware to handle JSON and urlencoded form data//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// TODO To give the session grant to the customer routes
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
// ~ Authentication Middleware  ~ //
app.use("/customer/auth/*", function auth(req,res,next){
if(req.session.authorization){
    let token=req.session.authorization['accessToken'];
    jwt.verify(token,'access',(err,user)=>{
        if(err){
            // ^ It is for returning the fallback first then user assign //
            return res.status(401).json({ message: 'Invalid or expired token' });

        }
            req.user=user;
            next();
    });
}
else {
    return res.status(403).send('Unauthorized');
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
