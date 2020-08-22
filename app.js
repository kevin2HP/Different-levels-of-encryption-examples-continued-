
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs')
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/studyPageDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const postSchema = {
    title: String,
    content: String
}
const userSchema = {
    email:String,
    password:String
};
const User = new mongoose.model('User',userSchema);

const Post = new mongoose.model('Post',postSchema);
app.get('/fail',function (req,res) {
    res.render('fail')
  });
app.route('/')
.get(function(req,res){
    res.render('login')
})
.post(function(req,res){
    User.findOne({email:req.body.username},function (err,user) { 
        if(err){
            console.log(err);
        }else{
            if(user){
                if(user.password === req.body.password){
                    res.redirect('/index')
                }
            }else{
                res.redirect('/fail')
            }
        }
     }) 
});

app.route('/register')
.get(function(req,res){
    res.render('register')
})
.post(function (req,res) {  
    const newUser = new User({
        email:req.body.email,
        password:req.body.password
    })
    newUser.save(function (err) {
        if(err){
            console.log(err);
        }else{
            console.log('Successfully registered');
            res.redirect('/')
        }
      });
});

app.route('/index')
    .get(function (req, res) {
        Post.find(function (err,foundItems) {  
            if(err){
                console.log(err);
            }else{
                res.render('index',{posts:foundItems})
            }
        })
        // res.render('index')
    })
    .post(function(req,res){
        const newPost = new Post({
            title:req.body.title,
            content:req.body.content
        })
        newPost.save()
        res.redirect('/index')
    });




app.post('/delete',function (req,res) {
    const checkItemId = req.body.checkbox;
    Post.findOneAndDelete(checkItemId,function (err) {
        if (err){
        console.log(err);
        }else{
        console.log('Successfully deleted');
        res.redirect('/');
        }
        })
    });



app.listen(3000, function () {
    console.log('Server started on port 3000');
})