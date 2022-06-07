import Express from 'express';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const app = Express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
