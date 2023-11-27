let express = require("express");
let app = express();
let port = 8080;

app.use(express.static('css'));

let httpServer = app.listen(port, function () {
    console.log(`Webbservern körs på port ${port}`);
});

app.use(express.urlencoded({ extended: true }));

let fs = require("fs");

app.get("/form", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/", function(req, res) {
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

app.get("/loggin", function(req,res){
    res.sendFile(__dirname + "/loggin.html")
});

let mysql = require("mysql");

let con = mysql.createConnection({
    hots: "localhost",
    user: "root",
    password: "",
    database: "frontend23",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("uppkopplad till databas!");
    con.query("SELECT * FROM inlamning", function (err, result, fields) {
    if (err) throw err;
    console.log(result);        
 /*    console.log(result[0]); */
   /*  console.log(result[0].name);  */   
    })
});

app.post("/loggin", function(request, response) {
    let username = request.body.username;
    let password = request.body.password;
 
    if (username && password) {
        con.query('SELECT * FROM inlamning WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {   
            if (error) throw error;
            if (results.length > 0) {
                response.redirect("/myForum");
            } else {
                response.send('Incorrect Username and/or Password!');
            }			
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});


app.get("/myForum", function(req, res){
    res.sendFile(__dirname + "/forum.html")
});













/* let con = mysql.createConnection({
    host: "localhost", // IP-adress till databas-servern
    user: "root", // standard-användarnamn till XAMPPs databas
    password: "", // standardlösenord
    database: "niklasforum", // ÄNDRA TILL NAMN PÅ DIN DATABAS
  });
  
  app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'static')));
  
  app.get('/', function(request, response) {
      // Render login template
      response.sendFile(path.join(__dirname + '/login.html'));
  });
 */
/* let con = mysql.createConnection({
    host: "localhost", // IP-adress till databas-servern
    user: "root", // standard-användarnamn till XAMPPs databas
    password: "", // standardlösenord
    database: "niklasforum", // ÄNDRA TILL NAMN PÅ DIN DATABAS
  });
  
  app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'static')));
  
  app.get('/', function(request, response) {
      // Render login template
      response.sendFile(path.join(__dirname + '/login.html'));
  });
  
  
  app.post('/checklogin', function(request, response) {
      // Capture the input fields
      let username = request.body.username;
      let password = request.body.password;
      // Ensure the input fields exists and are not empty
      if (username && password) {
          // Execute SQL query that'll select the account from the database based on the specified username and password
          con.query('SELECT * FROM niklasforum WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
              // If there is an issue with the query, output the error
              if (error) throw error;
              // If the account exists
              if (results.length > 0) {
                  // Authenticate the user
                  request.session.loggedin = true;
                  request.session.username = username;
                  // Redirect to home page
                  response.redirect('/main');
              } else {
                  response.send('Incorrect Username and/or Password!');
              }			
              response.end();
          });
      } else {
          response.send('Please enter Username and Password!');
          response.end();
      }
  });
  
  app.get('/login', function(request, response) {
      // If the user is loggedin
      if (request.session.loggedin) {
          // Output username
      response.send('Welcome back, ' + request.session.username + '!');
      response.redirect('/main');
      
      
    
      } else {
          // Not logged in
          response.send('Please login to view this page!');
      }
      response.end();
  });
  
  
  
  exports.logout = (req,res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
  };
 */




