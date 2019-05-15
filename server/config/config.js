// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let url_db;
if ( process.env.NODE_ENV === 'dev' ) {
    url_db = 'mongodb://192.168.1.21:26017/coffee';
} else {
    url_db = 'mongodb+srv://yamaha6297:GwJTHWwy8Hoppr9L@cluster0-jz8da.mongodb.net/test'
}
process.env.URL_DB = url_db;
