const express=require("express")
const cors=require("cors")
const app = express()
const PORT = 4000

//required database models
const User = require('./models/users')  //(User)Model name -in user.js last export line we declare a model name 
const Post =require('./models/posts')

const mongoose = require('mongoose')
const { findById } = require("./models/posts")
mongoose.set('strictQuery',false)

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors()) //cors orgin resource - its use to connect frontEnd to backEnd (between two origin to pass the data we use cors ) 

const dbURL = "mongodb://localhost:27017/food"
mongoose.connect(dbURL).then(()=>{
    console.log("connected to database");
})

app.post('/login',(req,res)=>{
    User.findOne({email:req.body.email},(err,userData)=>{
        if(userData) {
            if (req.body.password == userData.password) {
                res.send({message:'login successfull'})
            } else {
                res.send({message:'login failed'})
            }
        }else{
            res.send({message:'no account seems to be matched with your email'})
        }
    })

})

app.post('/signup',async(req,res)=>{
    User.findOne({email:req.body.email},(err,userData)=>{      //first is check the email it matches any onther email we use this line METHOD is findOne, ({email:req.body.email} this is get emails list from front end
        if(userData){
            res.send({message:'Seems like you already have a account with this email address'})
        }else{
            const data = new User({             //model name
                name:req.body.name,
                mobile:req.body.mobile,
                email:req.body.email,
                password:req.body.password
                
            })
            data.save(()=>{
                if (err) {
                    res.send(err)
                } else {
                    res.send({message:"User registered successfully"})
                }
            })
        }
    }) 
    
})

app.get("/posts",async(req,res)=>{
    try {
        const posts= await Post.find()
        res.json(posts)
    } catch (error) {
        console.log(err);
    }

})

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
        const posts = await Post.findById(id)
        res.send(posts)
    } catch (error) {
        res.send(error)
    }
})



app.post('/add-post',async(req,res)=>{
    let postData = new Post({
        author:req.body.author,
        title:req.body.title,
        summary:req.body.summary,
        image:req.body.image,
        location:req.body.location
    })
    try{
        await postData.save()
        res.send({message:"post added succesfully"})
    }catch(err){
        res.send({message:"Failed to add post"})
    }
})



app.listen(PORT,()=>{
    console.log(`listening on the port ${PORT}`);
})