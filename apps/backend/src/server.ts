import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const corsOrigin = allowedOriginsEnv
  ? allowedOriginsEnv.split(',').map((origin) => origin.trim())
  : true; // permissive fallback for local dev / zero-config runs

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(routes);

const port = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`QuickCart backend listening on port ${port}`);
  });
}

export default app;
