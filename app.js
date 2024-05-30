require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Import module express-session
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db')

const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

//Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }), 
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
    //Date.now() - 30 * 24 * 60 * 60 * 1000 
}));


// Sử dụng thư mục 'public' cho các tệp tĩnh
// app.use(express.static('public'));

// Cấu hình middleware static để phục vụ các tệp tin tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// Bắt đầu server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
