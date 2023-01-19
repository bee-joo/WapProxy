import express from 'express';
import fetch from 'node-fetch';
import { preparePage } from './parse.js';
import { emptyUrlMiddleware, protocolMiddleware, errorHandlerMiddleware, refererMiddleware } from './middleware.js';

const app = express();

app.use(emptyUrlMiddleware);
app.use(protocolMiddleware);

app.get('/', async (req, res) => {
  let url = res.locals.url;
  let response = await fetch(url);

  if (response.headers.get('content-type') != 'text/vnd.wap.wml') {
    res.send('Это не WML страница');
  } else {
    let body = await response.text();
    res.send(preparePage(body, url));
  }
});

app.get('/img', refererMiddleware, async (req, res) => { // сделать без referer (например через cookie)
  let url = res.locals.url;
  let response = await fetch(url);
  let contentType = response.headers.get('content-type');
  
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(await response.buffer()); // deprecated, надо пробовать другое
});

app.use(errorHandlerMiddleware);

app.listen(3000);