const express = require('express')
const app = express()
const helmet = require('helmet')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const formParser = bodyParser.urlencoded({extended: false})

const port = 3000

app.get('/', (req,res) => { res.render('login.pug') })

app.post('/login', formParser, (req,res) => {
    res.send(`Hello ${req.body.username}`)
})

app.listen(port, () => {
    console.log(`Server launched on port ${port}`)
})