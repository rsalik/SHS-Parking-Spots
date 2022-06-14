import Express from 'express';
import { config as dotenvConfig } from 'dotenv';
import { verify } from './auth';
import { authorizeGoogleSheets, getSheetData } from './sheets';

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

app.get('/', async (req, res) => {
  res.send('Hello World.');
});

app.get('/taken-spots', async (req, res) => {
  const data = await getSheetData();

  if (!data) {
    res.status(500).send('Error getting data');
    return;
  }

  const spots = data.map((r) => parseInt(r[1])).filter((n) => !isNaN(n));
  res.send(spots);
});

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
  authorizeGoogleSheets().then(async () => console.log(await getSheetData()));
});
