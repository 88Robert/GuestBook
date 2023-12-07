let express = require("express");
let app = express();
let port = 8080;

app.use(express.static("css"));

let httpServer = app.listen(port, function () {
  console.log(`Webbservern körs på port ${port}`);
});

app.use(express.urlencoded({ extended: true }));

let fs = require("fs");

app.get("/form", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/", function (req, res) {
  let inlagg = JSON.parse(fs.readFileSync("inlagg.json").toString());

  let output = "";
  for (let i = 0; i < inlagg.length; i++) {
    output += `<p><b>${inlagg[i].author}</b> från ${inlagg[i].from} skriver: <br> ${inlagg[i].message} </p>`;
  }
  let html = fs.readFileSync("index.html").toString();
  html = html.replace("***GÄSTER***", output);
  res.send(html);
});

app.post("/", function (req, res) {
  let inlagg = fs.readFileSync("inlagg.json").toString();
  inlagg = JSON.parse(inlagg);

  console.log(req.body);
  inlagg.push(req.body);

  let jsonText = JSON.stringify(inlagg);

  fs.writeFileSync("inlagg.json", jsonText);

  let output = "";
  for (let i = 0; i < inlagg.length; i++) {
    output += `<p><b>${inlagg[i].author}</b> från ${inlagg[i].from} skriver: <br> ${inlagg[i].message} </p>`;
  }
  let html = fs.readFileSync("index.html").toString();
  html = html.replace("***GÄSTER***", output);
  res.send(html);
  location.reload();
});

/* Till denna rad är det vanliga guestbook - delen som man 
inte behöver logga in på. Använder endas JSON och inte databas. */

app.get("/loggin", function (req, res) {
  res.sendFile(__dirname + "/loggin.html");
});

let mysql = require("mysql");

let con = mysql.createConnection({
  hots: "localhost",
  user: "root",
  password: "",
  database: "frontend23",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("uppkopplad till databas!");
  con.query("SELECT * FROM inlamning", function (err, result, fields) {
    if (err) throw err;
    /* console.log(result);     */
    /*    console.log(result[0]); */
    /*  console.log(result[0].name);  */
  });
});

let cookieParser = require("cookie-parser");
app.use(cookieParser());
let session = require("express-session");
let oneHour = 1000 * 60 * 60;
app.use(
  session({
    secret: "HemligtokensomintekanavkodasXy6333%/&",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);

app.post("/loggin", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    con.query(
      "SELECT * FROM inlamning WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          session = req.session;
          session.userID = req.body.username;
          session.name = results[0].name;
          res.redirect("/myForum");
        } else {
          res.send(`
          <p>Felaktigt användarnamn eller lösenord!</p>
          <p><a href='/loggin'>Tillbaka till inloggningssidan</a></p>`);
        }
      }
    );
  }
});

app.get("/myForum", function (req, res) {
  //let session = req.session;
  let name = req.session.name;
  let html = fs.readFileSync("forum.html").toString();
  html = html.replace("***NAME***", name);
  res.send(html);
  con.query("SELECT * FROM posts", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

app.post("/myForum", function (req, res) {
  con.connect(function (err) {
    let sql = `INSERT INTO posts(topic, comment)
      VALUES ('${req.body.topic}', '${req.body.comment}')`;
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) console.log(err);
      res.redirect("/myForum");
    });
  });
});
