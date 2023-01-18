import express from 'express';
import fetch from 'node-fetch';
import { preparePage } from './parse.js';

const app = express();

app.get('/', async (req, res) => {
  let url = req.query.url;
  if (url == null) {
    res.send("Пришлите строку")
  } else {
    try {
      let response = await fetch(url);
      let body = await response.text();
      res.send(preparePage(body, url));
    } catch (e) {
      console.log(e);
      res.send('Произошла ошибка');
    }
  }
});

app.get('/img', async (req, res) => {
  let url = req.query.url;
  if (url == null) {
    res.send("Пришлите строку")
  } else {
    try {
      let response = await fetch(url);
      let contentType = response.headers.get('content-type');
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(await response.buffer());
    } catch (e) {
      console.log(e);
      res.send('Произошла ошибка');
    }
  }
});

app.listen(3000);