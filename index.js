const Koa = require('koa');
const koaBody = require('koa-body');
const tiny = require('tiny-json-http');

const app = new Koa();

app.use(koaBody());

const endpoints = {};
app.use(async function webApp(ctx) {
  const { request } = ctx;
  const rule = /\/api\/(.+)/;
  const match = rule.exec(request.url);
  if (!match) {
    return ctx.throw(404, 'Bad URL');
  }
  const [, ep] = match;
  if (!endpoints[ep]) {
    return ctx.throw(404, 'Endpoint not found');
  }
  const { response, sendToQueue } = endpoints[ep];
  const { url, method, header, body } = request;
  const execution = sendToQueue({ url, method, header, body });
  if (response) {
    const result = await execution;
    if (result.ok) {
      ctx.body = result.value;
    } else {
      ctx.throw(500, result.error);
    }
  } else {
    ctx.body = { ok: true };
  }
});

module.exports = ({ port = 9999 }, log) => {
  app.listen(port, () =>
    log.info(`Listening on http://localhost:${port}/api/:endpoint`)
  );
  return {
    type: 'web',
    input({ endpoint, response }, sendToQueue) {
      endpoints[endpoint] = { response, sendToQueue };
    },
    output({ url, method }) {
      method = method.toLowerCase();
      if (method !== 'get' && method !== 'post') {
        throw new Error(`Method "${method}" is not supported`);
      }
      let dataHandler = data => tiny[method]({ url, data });
      if (method === 'get') {
        dataHandler = dataHandler.bind(null, null);
      }
      return dataHandler;
    },
  };
};
