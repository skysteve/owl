import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { initRouter } from './router';
import { initMongoDB } from './dbConnection';

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// self executing fn to allow for async/await
(async () => {
  const mongoDB = await initMongoDB();
  initRouter(app, mongoDB);

  app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
})();

