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

const nodemailerMiddlewares = require('./nodemailer-middlewares')
const nodemailer = require('nodemailer')


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

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username == 'admin' && password == 'admin') {
            User.findOne({username}, (err, user) => {
                if (err) return done(err)
                if (!user) return done(null, false, {
                    message: 'Utilisateur admin  non trouvé'
                })
                if (user.password !== password ) {
                    return done(null, false, {
                        message: 'Mot de passe admin incorrect'
                    })
                }
                return done(null, user)
            })
        } else {
            return done(null, false, {
                message: `Vous n'avez pas accès à cette page`
            })
        }
        
    }
))

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb+srv://walid:zinedine10@cluster0-szh3u.mongodb.net/tp', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'ERREUR MONGODB:'))
db.once('open', () => console.log('MONGODB EST CONNECTE'))

const User = require('./models/User')
const Token = require('./models/Token')

app.get('/', (req,res) => { res.render('signup.pug') })
app.get('/signup', (req,res) => { res.render('signup.pug') })

app.post('/user', formParser, (req,res) => {
    const {email, username, password} = req.body
    const newUser = new User({ email, username, password })
    User.findOne({username}, (err, user) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (user) {
            return res.status(500).send(`Le nom d'utilisateur ${username} est déjà utilisé`)
        }
        newUser.save((err, user) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Erreur du serveur. post/user')
            }
            const userToken = new Token({
                _userId: user._id,
                token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            })
            userToken.save((err, token) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send('Erreur du serveur. post/token')
                }
                console.log(`Token ${token._id} enregstré`)
                
            })
            nodemailerMiddlewares.sendMail(userToken.token, user.email)
            res.render('handleSignup.pug')
        })
    })
})

app.get('/token/:tokenId', (req, res) => {
    const { tokenId } = req.params
    Token.findOne({ token: tokenId }, (err, token) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (!token) {
            return res.status(500).send(`Le token ${tokenId} n'éxiste pas ou a expiré. Veuillez refaire l'incription.`)
        } 
        User.findByIdAndUpdate(token._userId, {isVerified: true}, (err, user) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (user) {
                res.render('accountVerified.pug')
            }
        })
    })
})

app.post('/handleAdmin', formParser, passport.authenticate('local', {
    successRedirect: '/handleAdmin',
    failureRedirect: '/admin'
}))

app.get('/handleAdmin', isLoggedIn, (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.render('handleAdmin.pug', {
            users: users 
        })
    }).select('username email')
    
})

app.get('/accountVerified', (req, res) => {
    res.render('accountVerified')
})

// Partie ADMIN
app.get('/admin', formParser, (req,res) => {
    res.render('admin.pug')
})

app.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    console.log(`{'message': 'successfully logout'}`)
    res.render('admin.pug')
});

app.listen(port, () => {
    console.log(`Server launched on port ${port}`)
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}