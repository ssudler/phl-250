import express from 'express';
import morgan from 'morgan';
import http from 'http';
import { exec } from 'child_process';
import createStickerImage from '../helpers/create-sticker-image.js';

const port = parseInt(process.env.PORT, 10) || 9000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();
const server = http.createServer(app);

app.set('trust proxy', !dev);
app.disable('x-powered-by');

app.use(morgan(dev ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/print', async (req, res) => {
  console.log('Initiating print job with base64 image data', req.body.data);

  if (!req.body.data) return res.sendStatus(400);

  await createStickerImage(req.body.data);

  const printCommand = 'lp ./assets/composite.png';

  exec(printCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.sendStatus(400);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.sendStatus(400);
    }

    console.log(`stdout: ${stdout}`);
  });

  return res.sendStatus(200);
});

server.listen(port, () => {
  console.log('Listening on port', port);
});
