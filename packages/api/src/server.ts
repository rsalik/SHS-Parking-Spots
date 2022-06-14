import Express from 'express';
import cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import { verify } from './auth';
import { authorizeGoogleSheets, claimSpot, getClaimedSpots as getTakenSpots, getSheetData } from './sheets';

dotenvConfig();

const app = Express();
const port = process.env.PORT || 3001;

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(Express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
  res.send('Hello World.');
});

app.get('/api/taken-spots', async (req, res) => {
  const data = await getTakenSpots();

  if (!data) {
    res.status(500).send({ error: 'Error getting data' });
    return;
  }

  res.send(data);
});

app.post('/api/login', async (req, res) => {
  const { token } = req.body;
  let user = await verify(token);

  if (user) {
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 15);
    res.cookie('token', token, { expires: tokenExpiration, httpOnly: true, secure: true });
    res.cookie('signedIn', 'true', { expires: tokenExpiration, httpOnly: false, secure: false });

    res.json({ user: user, expires: tokenExpiration });
    return;
  }

  res.status(401).json({ error: 'Invalid token' });
});

app.post('/api/claim-spot', async (req, res) => {
  const { spot, licensePlate } = req.body;

  const { token, signedIn } = req.cookies;

  if (!token) {
    res.status(401).json({ error: 'No token' });
    return;
  }

  if (!signedIn) {
    res.status(401).json({ error: 'Invalid user' });
    return;
  }

  if (isNaN(parseInt(spot))) {
    res.status(400).json({ error: 'Invalid spot' });
    return;
  }

  const user = await verify(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // TODO: Verify user

  const takenSpots = await getTakenSpots();
  if (takenSpots && takenSpots.includes(parseInt(spot))) {
    res.status(403).json({ error: 'Spot already taken' });
    return;
  }

  await claimSpot(user, parseInt(spot), licensePlate);
  res.status(200).send('Success');
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
  authorizeGoogleSheets();
});
