import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';

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
    console.log(`User ${socket.id} has sent image`);

    acknowledgeEvent();

    io.emit('displayImage', { signatureImage });

    const formattedPromptText = ['.', '!', '?'].includes(promptText.slice(-1)) ? promptText : `${promptText}.`;

    await axios.post(`${process.env.STICKER_API_BASE_URL}/print`, { data: formattedPromptText });
  });
});

server.listen(port, async () => {
  console.log('Listening on port', port);
});
