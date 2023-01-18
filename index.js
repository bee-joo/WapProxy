import express from 'express';
import fetch from 'node-fetch';
import { preparePage } from './parse.js';

const app = express();

const emptyUrlMiddleware = (req, res, next) => {
  let url = req.query.url;
  if (req.query.url == null) {
    res.send('Пришлите строку');
  } else {
    res.locals.url = url;
    next();
  }
}

const protocolMiddleware = (req, res, next) => {
  let url = res.locals.url;
  if (!url.startsWith("http")) {
    res.locals.url = "http://" + url;
  }
  next();
}

app.use(emptyUrlMiddleware);
app.use(protocolMiddleware);

app.get('/', async (req, res) => {
  let url = res.locals.url;
  let response = await fetch(url);
  let body = await response.text();
  res.send(preparePage(body, url));
});

app.get('/img', async (req, res) => {
  let url = res.locals.url;
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