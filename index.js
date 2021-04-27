// require your server and launch it here
const express = require('express');

const postsRouter = require('./api/posts/posts-router');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRouter);

server.use('/', (req, res) => {
  res.status(200).send('Hello from express')
})

server.listen(8000, () => {
  console.log(`magic happening on port 8000`)
});