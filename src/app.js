import express from 'express'; // <== sucrase lets this happen
import routes from './routes'; // without it => needs require(...)

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // <== <==

// sucrase lets this happen
// without sucrase => module.exports = <...>
