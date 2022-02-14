const express = require("express");
const Podlet = require("@podium/podlet");
const fs = require("fs");

const app = express();

const podlet = new Podlet({
  name: "svelte-app-two", 
  version: "0.1.0",
  pathname: "/", 
  manifest: "/manifest.json", 
  development: true, 
});


podlet.css({ value: "http://localhost:3101/css/global.css" });
app.use("/css", express.static("public/css/"));

let buildfiles = fs.readdirSync('public/build');
buildfiles.forEach((element, index) => {
  if(element.indexOf('.css') !== -1 && element.indexOf('.css.map') === -1){
    podlet.css({ value: "http://localhost:3101/build/" + element });
  }else if(element.indexOf('.js') !== -1 && element.indexOf('.js.map') === -1) {
    podlet.js({ value: "http://localhost:3101/build/" + element, defer: true });
  }
});
app.use("/build", express.static("public/build/"));



app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
  res.status(200).podiumSend('<div id="svelte-app-two"></div>');
});

app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});

app.listen(3101);