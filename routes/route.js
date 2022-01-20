const express = require('express')
const router = express.Router()
const multer = require('multer')
const User = require('../models/user')
const Student = require('../models/student')
const Class = require('../models/class')
const bcrypt = require('bcrypt');

const isUser = require('../middleware/isUser')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/',(req,res) => {

    if(req.session.user) {
        return res.redirect('/dashboard')
    }
    res.render('signin')
})

router.post('/check',async (req,res) => {
    // console.log(req.body);
    
    const result = await User.find({email:req.body.username})
    const isValid = bcrypt.compareSync(req.body.password, result[0].password);

    if(isValid) {
        req.session.user = result[0]
        req.session.save()

        res.redirect('/dashboard')
    }
    else {
        res.redirect('/')
    }

    // console.log(result);
    // if(result.length > 0) {

    //     req.session.user = result[0]
    //     req.session.save()

    //     res.redirect('/dashboard')
    // }
    // else {
    //     res.redirect('/')
    // }
})


router.get('/signup',async(req,res) => {

    res.render('signup')
})

router.get('/logout',async (req,res) => {

    req.session.destroy()
    res.redirect('/')
})

router.post('/saveuser',async(req,res) => {
    console.log(req.body);
    const hash = bcrypt.hashSync(req.body.password, 10);
    var data= {
        username:req.body.username,
        email:req.body.email,
        password:hash
    }
    const result = await User(data).save()
})

router.get('/dashboard',isUser,(req,res) => {
    res.render('hello')
})

router.get('/addstudent',isUser,async (req,res) => {
    const classes = await Class.find()
    res.render('addstudent',{classes})   
})
router.post('/savestudent',upload.single('fufile'),async(req,res) => {
    var data = {
        rollno:req.body.rollno,
        name:req.body.name,
        fname:req.body.fname,
        class:req.body.class
    }  
    const result = await Student(data).save()
     //console.log(req.file);
    res.redirect('/addstudent')  
})

router.get('/getdata',isUser,async (req,res) => {
 
    const result = await Student.find({})

    res.render('viewdata',{result})
})

router.get('/deletestudent/:id',async (req,res) => {
    const id = req.params.id
    const result = await Student.findByIdAndDelete(id)

    res.redirect('/getdata')

})
    
router.get('/editstudent/:id',async (req,res) => {
    const id = req.params.id
    const result = await Student.find({_id:id})
    const classes = await Class.find()
    // console.log(classes);

    res.render('editstudent',{result,classes})
})

router.get('/fileupload',(req,res) => {
    res.render('fileupload')
})
router.post('/upload',upload.single('fufile'),(req,res) => {
    console.log(req.file);
})

module.exports = router