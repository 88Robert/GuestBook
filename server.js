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







