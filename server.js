const express = require('express')
const app = express()
const helmet = require('helmet')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const formParser = bodyParser.urlencoded({extended: false})

const port = 3031

const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy

app.use(helmet())
app.use(session({secret: 'phraseSecrete', resave: false, saveUninitialized: false})) //faire des cookies pour le serveur
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user,done) => {
    done(null, user)
})
passport.deserializeUser((user,done) => {
    done(null, user)
})

mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb+srv://walid:zinedine10@cluster0-szh3u.mongodb.net/tp', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'ERREUR MONGODB:'))
db.once('open', () => console.log('MONGODB EST CONNECTE'))

const User = require('./models/User')

app.get('/', (req,res) => { res.render('signup.pug') })

// Partie INSCRIPTION
app.post('/user', formParser, (req,res) => {
    // persister users
    // envoyer mail avec lien localhost/user/:_id
    // put isVerified = true
    // render pageVerifierMail
    res.send(`Hello ${req.body.username}`)
})

app.put('/user/:_id', (req, res) => {
    // mettre à jour isVerified
    // redirect /user/:_id
})

app.get('/accountVerified', (req, res) => {
    res.render('accountVerified')
    // post
})

// Partie LOGIN
app.get('/signin', formParser, (req,res) => {
    res.send(`Hello ${req.body.username}`)
})


app.post('/signin', formParser, (req,res) => {
    // verifier isVerified=true
    // verifier mdp et si user existe
    // redirect vers page user
    res.send(`Hello ${req.body.username}`)
})

// Partie ADMIN
app.post('/admin', formParser, (req,res) => {
    // affiche la liste des users vérified --> que l'admin qui peut voir
    res.send(`Hello ${req.body.username}`)
})

app.listen(port, () => {
    console.log(`Server launched on port ${port}`)
})