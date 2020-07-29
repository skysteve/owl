import * as express from 'express';
import { initRouter } from './router'

const app = express();
const port = 3000;

initRouter(app);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));