const express = require('express');
const path = require('path');

const app = express();

// Server routes...
app.get('/hello', (req, res) => res.send({ hi: 'there' }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
} else {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackConfig = require('./webpack.config');

  const devMiddleware = webpackMiddleware(webpack(webpackConfig));

  app.use(devMiddleware);
  app.get('*', (req, res) => {
    res.set('Content-Type', 'text/html');

    res.send(
      devMiddleware
        .fileSystem
        .readFileSync(
          `${webpackConfig.output.path}/index.html`
        )
    );
  });
}

app.listen(process.env.PORT || 3050, () => console.log('Listening'));