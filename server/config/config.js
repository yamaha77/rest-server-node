// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let url_db;
if ( process.env.NODE_ENV === 'dev' ) {
    url_db = 'mongodb://192.168.1.21:26017/coffee';
} else {
    url_db = process.env.MONGO_URI;
}
process.env.URL_DB = url_db;
