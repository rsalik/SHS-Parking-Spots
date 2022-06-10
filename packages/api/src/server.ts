import Express from 'express';
import { config as dotenvConfig } from 'dotenv';
import { verify } from './google';

dotenvConfig();

const app = Express();
const port = process.env.PORT || 3001;

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(Express.json());

app.get('/', (req, res) => {});

app.post('/api/login', async (req, res) => {
  const { token } = req.body;
  let user = await verify(token);

  if (user) {
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24);
    res.cookie('token', token, { expires: tokenExpiration, httpOnly: true, secure: true });

    res.json({ user: user, expires: tokenExpiration });
    return;
  }

  res.status(401).json({ error: 'Invalid token' });
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
