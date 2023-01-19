import { host } from './config.js';

export const emptyUrlMiddleware = (req, res, next) => {
  let url = req.query.url;
  if (req.query.url == null) {
    res.send('Пришлите строку');
  } else {
    res.locals.url = url;
    next();
  }
};

export const protocolMiddleware = (req, res, next) => {
  let url = res.locals.url;
  if (!url.startsWith("http")) {
    res.locals.url = "http://" + url;
  }
  next();
};

export const refererMiddleware = (req, res, next) => {
  let referer = req.get('Referer');
  if (referer == null || !referer.startsWith(host)) {
    res.status(500).send('Нет доступа');
  } else {
    next();
  }
};

export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Произошла ошибка');
};