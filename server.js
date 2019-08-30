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
const Token = require('./models/Token')

app.get('/', (req,res) => { res.render('signup.pug') })

// Partie INSCRIPTION
app.post('/user', formParser, (req,res) => {
    // verifier mail pas deja pris
    // persister users
    const {email, password} = req.body
    const newUser = new User({ email, password })
    User.findOne({email}, (err, user) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (user) {
            return res.status(500).send(`Le mail ${email} est déjà utilisé`)
        }
        newUser.save((err, user) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Erreur du serveur. post/user')
            }
            //res.status(210).send(`Utilisateur ${user._id} enregstré`)
            const userToken = new Token({
                _userId: user._id,
                token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            })
            userToken.save((err, token) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send('Erreur du serveur. post/token')
                }
                res.status(210).send(`Token ${token._id} enregstré`)
            })
        })
    })
    // envoyer mail avec lien localhost/user/:_id
    // put isVerified = true
    // render pageVerifierMail
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