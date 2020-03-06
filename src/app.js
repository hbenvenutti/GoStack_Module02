import express from 'express'; // <== sucrase lets this happen
import path from 'path';

import routes from './routes'; // without it => needs require(...)

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
      // express.static() é um métod para arquivos estáticos;
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // <== <==

// sucrase lets this happen
// without sucrase => module.exports = <...>
