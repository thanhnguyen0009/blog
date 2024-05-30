const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import module jsonwebtoken
const jwtSecret = process.env.JWT_SECRET;


//check login
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorzed' } );
    }

    try {
        const decode = jwt.verify(token, jwtSecret);
        req.userId = decode.userId;
        next();
    } catch(error){
        res.status(401).json( { message: 'Unauthorzied' } );
    }
}



const adminLayout = '../views/layouts/admin';

// Admin login page
router.get('/admin', async (req, res) => {    
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error){
        console.log(error);
    }
});

// Admin login
router.post('/admin', async (req, res) => {    
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials ' });
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');
    } catch (error){
        console.log(error);
    }
});

// Admin dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {  

    try {
        const locals = {
            title: "Dashboard",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        }); 

    } catch(error){
        console.log(error);
    }
});

//get
// Admin create new post
router.get('/add-post', authMiddleware, async (req, res) => {  

    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        }); 

    } catch(error){
        console.log(error);
    }
});

//post
//admin - create new post
router.post('/add-post', authMiddleware, async (req, res) => {  

    try {
        console.log(req.body);
        
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error){
            console.log(error);
        }

    } catch(error){
        console.log(error);
    }
});


//get
// Admin create new post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {  
    try {

        const locals = {
            title: "Edit Post",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }

        const data = await Post.findOne({ _id: req.params.id });

        // Điều chỉnh dữ liệu và gửi phản hồi đến trang chỉnh sửa bài đăng
        res.render('admin/edit-post', {
            locals, // Khai báo locals ở đây nếu cần
            data,
            layout: adminLayout
        });

        // Không gọi res.redirect() ở đây
    } catch (error) {
        console.log(error);
    }
});





//put
// Admin create new post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {  

    try {
       await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updateAt: Date.now()
       });

       res.redirect(`/edit-post/${req.params.id}`);

    } catch(error){
        console.log(error);
    }
});



//delete
// Admin delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {  

    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/dashboard');
    } catch(error) {
        console.log(error);
    }

});


//get
// Admin logout
router.get('/logout', (eq, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout Successful!'});
    res.redirect('/');
});




// Admin register
router.post('/register', async (req, res) => {    
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);    

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User Created', user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error){
        console.log(error);
    }
});

module.exports = router;
