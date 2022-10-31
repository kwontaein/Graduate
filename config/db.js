const mysql=require("mysql");

const con = mysql.createConnection({
    multipleStatements: true
});

const db =mysql.createConnection({
host:"ci2022kingsman.cechmfqjqioq.ap-northeast-2.rds.amazonaws.com",
user:"ci2022kingsman",
password:"2022kingsman",
database:"ci2022kingsman",
    
});
db.connect();


module.exports=db;