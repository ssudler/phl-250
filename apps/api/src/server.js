import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
import updateDatabase from './services/sheets.js';
import createPrintRequest from './services/print.js';

const port = parseInt(process.env.PORT, 10);
const dev = process.env.NODE_ENV !== 'production';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
  },
});

app.set('trust proxy', !dev);
app.disable('x-powered-by');

app.use(morgan(dev ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('submit', async ({ promptText, signatureImage }, acknowledgeEvent) => {
    console.log(`User ${socket.id} has sent image with prompt ${promptText}`);

    acknowledgeEvent();

    io.emit('displayImage', { signatureImage });

    const formattedPromptText = ['.', '!', '?'].includes(promptText.slice(-1)) ? promptText : `${promptText}.`;
    await updateDatabase(promptText, signatureImage);
    await createPrintRequest(formattedPromptText);
  });
});

server.listen(port, async () => {
  console.log('Listening on port', port);
});
