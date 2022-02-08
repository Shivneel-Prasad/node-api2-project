// implement your server here
// require your posts router and connect it here
const express = require('express');
const morgan = require('morgan')
const postsRouter = require('./posts/posts-router')

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json())

// Configure your server here
server.use(morgan('dev'))
server.use('/api/posts', postsRouter)

server.use('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Not Found',
    })
})

module.exports = server;
