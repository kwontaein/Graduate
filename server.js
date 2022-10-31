const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const db = require('./config/db');

const server = require('http').createServer(app);

app.use(cors()); // cors 미들웨어를 삽입합니다.

server.listen(8080, ()=>{
  console.log('server is running on 8080')
})

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


//auth
app.post("/register", (req, res) => {
  console.log("/register", req.body);
  var id = req.body.id;
  var name = req.body.name;
  var psword = req.body.psword;
  var email = req.body.email;
  var num = req.body.num;

  const sqlQuery="INSERT INTO admin(id,psword,name,email,phone) VALUES(?, ?, ?, ?, ?);";
  db.query(sqlQuery, [id, psword, name, email,num], (err, result) => {
    res.send(result);
  });
});


app.post("/login", (req, res) => {
  console.log("/login", req.body);
  var id = req.body.id;
  var pw = req.body.psword;

  const sqlQuery =
    "select name from admin where id =? and psword =?;";
  db.query(sqlQuery, [id, pw], (err, result) => {

    res.send(result);
  });
});


//dashboard cards
app.get("/usercnt", (req, res) => {
  const sqlQuery = "select count(idx) as usercnt from users;";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/rsusercnt", (req, res) => {
  const sqlQuery = "SELECT DATE_FORMAT(date, '%Y%m%d') AS date, count(*) AS cnt FROM users WHERE date in (now());";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/rentalcnt", (req, res) => {
  const sqlQuery = "select count(id) as cnt FROM rentalcount where u_status1 in ('rental');";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/rsrentalcnt", (req, res) => {
  const sqlQuery = "select count(id) as cnt FROM rentalcount where u_status1 in ('rental') and date in (now());";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/Questions", (req, res) => {
  const sqlQuery = "select count(idx) as cnt  FROM board;";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/rsQuestions", (req, res) => {
  const sqlQuery = "select count(idx) as cnt  FROM board WHERE regdate in (now());";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/uUmbrellacnt", (req, res) => {
  const sqlQuery = "select count(id) as cnt  FROM usan2 WHERE u_status1 in ('rental')";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/nUmbrellacnt", (req, res) => {
  const sqlQuery = "select count(id) as cnt FROM usan2 WHERE u_status1 in ('return');";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});


app.get("/uUmnt", (req, res) => {
  const sqlQuery = "select *  FROM usan2 WHERE u_status1 in ('rental')";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});
app.get("/nUmcnt", (req, res) => {
  const sqlQuery = "select * FROM usan2 WHERE u_status1 in ('return');";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});


//dashboard charts

app.get("/weekuser", (req, res) => {
  const sqlQuery = "SELECT DATE_FORMAT(date, '%Y%m%d') AS date, count(*) AS cnt FROM users WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -1 WEEK ) AND NOW() GROUP BY DATE_FORMAT(date , '%m%d') ORDER BY date asc;";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});
app.get("/weekuser2", (req, res) => {
  const sqlQuery = "SELECT DATE_FORMAT(date, '%Y%m%d') AS date, count(*) AS cnt FROM users WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -1 WEEK ) AND NOW() GROUP BY DATE_FORMAT(date , '%m%d') ORDER BY date asc;";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});
app.get("/weeklyum", (req, res) => {
  const sqlQuery = "select count(id) as cnt, DATE_FORMAT(date, '%Y%m%d') AS date FROM rentalcount WHERE u_status1 in ('rental') and date BETWEEN DATE_ADD(NOW(), INTERVAL -2 WEEK ) AND NOW() GROUP BY DATE_FORMAT(date , '%Y%m%d') ORDER BY date asc;";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});
app.get("/weeklyrain", (req, res) => {
  const sqlQuery = "SELECT DATE_FORMAT(date, '%Y%m%d') AS date, Round(AVG(rain)) AS rainavg FROM raindate WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -2 WEEK ) AND NOW() GROUP BY DATE_FORMAT(date , '%m%d') ORDER BY date asc;  ";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});


//board
app.get("/list", (req, res) => {
  const sqlQuery = "select idx,title,writer,content,DATE_FORMAT(regdate, '%Y/%m/%d') as regdate from board;";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});


app.post("/delete_list", (req, res) => {
  const id = req.body.boardIdList;
  console.log(req.body.boardIdList);
  const sqlQuery = `DELETE FROM board WHERE idx IN (${id})`;
  db.query(sqlQuery,  (err, result) => {
    res.send(result);
  });
});

//adminlist
app.get("/adminlist", (req, res) => {
  const sqlQuery = "select id,name,psword,email,phone,DATE_FORMAT(date, '%Y/%m/%d') as date,idx  from admin;";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});

app.post("/insert_admin", (req, res) => {
  var idx = req.body.idx;
  var psword = req.body.psword;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  console.log(req.body.idx);
  const sqlQuery =
    "INSERT INTO admin (id,psword,name,email,phone) VALUES (?,?,?,?,?);";
  db.query(sqlQuery, [idx, psword,name,email,phone], (err, result) => {
    res.send(result);
  });
});

app.post("/update_admin", (req, res) => {
  const id = req.body.id;
  var idx = req.body.idx;
  var psword = req.body.psword;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  console.log(id);
  console.log(idx); 
  console.log(psword);
  const sqlQuery = `UPDATE admin SET id=?,psword=?,name=?,email=?,phone=? WHERE idx IN (${id})`;
  db.query(sqlQuery, [idx, psword,name,email,phone], (err, result) => {
    res.send(result);
  });
});

app.post("/delete_admin", (req, res) => {
  const id = req.body.boardIdList;
  console.log(req.body.boardIdList);
  const sqlQuery = `DELETE FROM admin WHERE idx IN (${id})`;
  db.query(sqlQuery,  (err, result) => {
    res.send(result);
  });
});


//userlist
app.get("/userlist", (req, res) => {
  const sqlQuery = "select id,name,psword,email,phone,DATE_FORMAT(date, '%Y/%m/%d') as date,idx  from users;";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});

app.get("/newlist", (req, res) => {
  const sqlQuery = "SELECT id,name,psword,email,phone,DATE_FORMAT(date, '%Y/%m/%d') as date,idx FROM users WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -1 WEEK ) AND NOW() order by date desc;";
  db.query(sqlQuery, (err, result) => {

    res.send(result);
  });
});

app.post("/insert_user", (req, res) => {
  var idx = req.body.idx;
  var psword = req.body.psword;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  console.log(req.body.idx);
  const sqlQuery =
    "INSERT INTO users (id,psword,name,email,phone) VALUES (?,?,?,?,?);";
  db.query(sqlQuery, [idx, psword,name,email,phone], (err, result) => {
    res.send(result);
  });
});

app.post("/update_user", (req, res) => {
  const id = req.body.id;
  var idx = req.body.idx;
  var psword = req.body.psword;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  console.log(id);
  console.log(idx); 
  console.log(psword);
  const sqlQuery = `UPDATE users SET id=?,psword=?,name=?,email=?,phone=? WHERE idx IN (${id})`;
  db.query(sqlQuery, [idx, psword,name,email,phone], (err, result) => {
    res.send(result);
  });
});

app.post("/delete_user", (req, res) => {
  const id = req.body.boardIdList;
  console.log(req.body.boardIdList);
  const sqlQuery = `DELETE FROM users WHERE idx IN (${id})`;
  db.query(sqlQuery,  (err, result) => {
    res.send(result);
  });
});


app.use( express.static( path.join(__dirname, 'graduate/build') ) );

app.get('/', function(request, response){
    response.sendFile( path.join(__dirname, 'graduate/build/index.html') )
});

app.get('*', function(request, response){
    response.sendFile( path.join(__dirname, 'graduate/build/index.html') )
});