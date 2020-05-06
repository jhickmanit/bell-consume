import { Router } from 'express'
import { Issuer } from 'openid-client'
import { onfido } from '../app'

var router = Router()
var oktaClient
var oktaIssuer

/* GET home page. */
router.get('/', async function(req, res) {
    const sess = req.session
    const applicant = sess.applicant
    const nonce = sess.nonce
    const state = sess.state
    if (applicant === undefined || applicant === '') {
        const issuer = await Issuer.discover(process.env.OIDC_DISCOVER)
            .then(issuer => {
                return issuer
            })
        oktaIssuer = issuer
        const client = new oktaIssuer.Client({
            client_id: process.env.OIDC_CLIENT_ID,
            redirect_uris: [process.env.APP_URL + 'cb'],
            response_types: ['id_token']
        })
        const authURL = client.authorizationUrl({
            scope: 'openid profile',
            response_mode: 'form_post',
            nonce,
            state,
        })
        oktaClient = client
        res.redirect(authURL)
        return
    } else {
        console.log('applicantId: ' + applicant)
        onfido.sdkToken.generate({
            applicantId: applicant,
            referrer: '*://*/*',
        })
            .then(token => {
                res.render('index', { token })
                return
            })
    }
    return
})

router.post('/cb', function(req, res) {
    const sess = req.session
    const nonce = sess.nonce
    const state = sess.state
    const params = oktaClient.callbackParams(req)
    console.log(params)
    oktaClient.callback(process.env.APP_URL + '/cb', params, { nonce, state })
        .then(tokenSet => {
            console.log(tokenSet)
            if (tokenSet.expired()) {
                res.status(401)
                res.locals.message = 'token expired'
                res.locals.error = { status: 500, stack: 'token expired'}
                res.render('error')
            }
            const claims = tokenSet.claims()
            console.log(claims)
            if (claims.applicant === '' || claims.applicant === undefined) {
                res.status(401)
                res.locals.message = 'applicant missing'
                res.locals.error = { status: 500, stack: 'applicant missing'}
                res.render('error')
            } else {
                req.session.applicant = claims.applicant
                res.redirect('/')
            }
        })
})

router.get('/complete', function(req, res) {
    const sess = req.session
    const applicant = sess.applicant
    if (applicant === '' || applicant === undefined) {
        res.status(500)
        res.render('error')
    }
    onfido.check.create({
        applicantId: applicant,
        reportNames: ['facial_similarity_photo'],
    }).then(response => {
        res.locals.message = response
        res.render('complete')
        return
    })
})

export default router
