//creating express server
const express = require('express');
const path = require('path');
const port = 8000;
const alert = require('alert');

//creating database
const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

//home page controller
app.get('/', function(req, res){

    Contact.find({}, function(err, contacts){
        if(err) {console.log('Error in fetching contacts from db'); return;}

        return res.render('home', { 
            title: "Contact List",
            contact_list: contacts  
        });
    });

});

//add contact page controller
app.get('/addContact', function(req, res){
    
    return res.render('addContact', { 
        title: "Add Contact"
    });
});

//update contact page controller
app.get('/updateContact', function(req, res){
    
    let id=req.query.id;
    Contact.find({"_id" : id}, function(err, contct){
        return res.render('updateContact', { 
            title: "Update Contact",
            contact: contct
        });
    });
});


//creating a contact
app.post('/create-contact', function(req, res){

    let phone = req.body.phone;
    let email = req.body.email;
    Contact.find({phone}, function(err, arr){
        if(err) {console.log('couldnt find number'); return;}
        if(arr.length != 0) {
            alert('Contact with same phone number or email already exists!!');
            return res.redirect('back');
        }
        else 
        {
            Contact.find({email}, function(err, arr){
                if(err) {console.log('couldnt find number'); return;}
                if(arr.length != 0) {
                    alert('Contact with same phone number or email already exists!!');
                    return res.redirect('back');
                }
                else
                {
                    Contact.create({
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email
                    }, function(err, newContact){
                        if(err) {console.log('error in creating a contact'); return;}
                
                        return res.redirect('/');
                    });
                }
            });
        }
    });
});

//searching a contact
app.post('/search-contact', function(req, res){

    let name = req.body.name;
    if(name == ""){
        return res.redirect('/');
    }

    Contact.find({name}, function(err, arr){
        if(err) {console.log('couldnt find name'); return;}


        return res.render('home', { 
            title: "Contacts",
            contact_list: arr  
        });
        
    });
});

//updating a contact
app.post('/update-contact', function(req, res){

    let id=req.query.id;
    Contact.findByIdAndUpdate(id,  {
        name : req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }, 
    function(err, docs) {
        if(err) {
            console.log("Error in modifying document");
            return;
        }
        return  res.redirect('/');
    });

    
});


//deleting a contact
app.get('/delete-contact', function(req, res){

    let id = req.query.id;

    Contact.findByIdAndDelete(id, function(err){
        if(err){console.log('error in deleting contact from database'); return; }

        return res.redirect('back');
    });

});

//Initiating our server 
app.listen(port, function(err){
    if(err)
        console.log('Oh !you ran into an error!');
    else 
        console.log('Server is running on port: ' + port);
});