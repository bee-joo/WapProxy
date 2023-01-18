import express from 'express';
import fetch from 'node-fetch';
import { preparePage } from './parse.js';

const app = express();

const emptyUrlHandler = (req, res, next) => {
  if (req.query.url == null) {
    res.send("Пришлите строку");
  } else {
    next();
  }
}

app.get('/', emptyUrlHandler, async (req, res) => {
  let url = req.query.url;
  let response = await fetch(url);
  let body = await response.text();
  res.send(preparePage(body, url));
});

app.get('/img', emptyUrlHandler, async (req, res) => {
  let url = req.query.url;
  let response = await fetch(url);
  let contentType = response.headers.get('content-type');
  
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(await response.buffer()); // deprecated, надо пробовать другое
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Произошла ошибка');
});

app.listen(3000);