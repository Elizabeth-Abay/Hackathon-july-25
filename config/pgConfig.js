const pg = require('pg')
const dotenv = require('dotenv')
const path = require('path');


dotenv.config({
    path: path.resolve(__dirname, '../.env')
});
// since the .env is outside this folder 


let { 
    data_base_user = booking_trips_app_client,
    data_base_host,
    data_base_user_password,
    data_base 
    } = process.env;

let pool = new pg.Pool({
    host : data_base_host,
    user : data_base_user,
    password : data_base_user_password,
    database : data_base
})


console.log(pool)


module.exports = pool