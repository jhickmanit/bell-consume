//import createError from 'http-errors'
import express from 'express'
import { join } from 'path'
import logger from 'morgan'
import session from 'express-session'
import { generators } from 'openid-client'
import { Onfido } from '@onfido/api'
import dotenv from 'dotenv'
dotenv.config()

import indexRouter from './routes/index'

var app = express()
export const onfido = new Onfido({
    apiToken: process.env.ONFIDO_API_TOKEN
})

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'pug')
 
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'public')))
app.use(session({secret: process.env.SESSION_SECRET,saveUninitialized: true, resave: true}))

app.use(function(req, res, next) {
    const sess = req.session
    const nonce = sess.nonce
    const state = sess.state
    if (nonce === undefined || nonce === '') {
        const newNonce = generators.nonce()
        req.session.nonce = newNonce
        if (state === undefined || state === '') {
            const newState = generators.state()
            req.session.state = newState
            next()
        }
        next()
    } else if (state === undefined || state === '') {
        const newState = generators.state()
        req.session.state = newState
        next()
    }
    next()
})


app.use(indexRouter)

// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
    next(createError(404))
}) */

/* // error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
}) */

export default app
