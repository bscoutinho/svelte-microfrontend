const express = require("express");
const app = express();

const Layout = require("@podium/layout");

const layout = new Layout({
  name: "podiumLayout",
  pathname: "/",
});

const svelteAppOne = layout.client.register({
  name: "svelte-app-one",
  uri: "http://localhost:3100/manifest.json",
});
const svelteAppTwo = layout.client.register({
  name: "svelte-app-two",
  uri: "http://localhost:3101/manifest.json",
});

app.use(layout.middleware());

app.get("/", async (req, res) => {
  const podiumLayout = res.locals.podium;

  const data = await Promise.all([
    svelteAppOne.fetch(podiumLayout),
    svelteAppTwo.fetch(podiumLayout),
  ]);

  podiumLayout.podlets = data;
  podiumLayout.view.title = "Composite App";

  res.podiumSend(`<div>
    ${data[0]}
    ${data[1]}
  </div>
  `);
});


app.listen(3000);