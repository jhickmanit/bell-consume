var Service = require('node-windows').Service

var svc = new Service({
    name: 'Onfido Okta Bell Demo',
    description: 'web based demo of Onfido + Okta for Bell',
    script: 'C:\\Program Files (x86)\\Bell Web App\\dist-server\\bin\\www.js',
    env: [{
        name: 'APP_URL',
        value: 'http://localhost:3000/'
    }, {
        name: 'OIDC_DISCOVER',
        value: 'https://horto.okta.com/oauth2/aus3t13z4vrUJhRBZ357/.well-known/oauth-authorization-server'
    }, {
        name: 'OIDC_CALLBACK',
        value: 'http://localhost:3000/cb'
    }, {
        name: 'OIDC_CLIENT_ID',
        value: '0oa3t13ox6zgloeIZ357'
    }, {
        name: 'OIDC_CLIENT_SECRET',
        value: 'aQNT40CxMHWha9gzh1JiFMVBwoOZU0wGUgrGZKxN'
    }, {
        name: 'SESSION_SECRET',
        value: 'sssshhhhh'
    }, {
        name: 'ONFIDO_API_TOKEN',
        value: 'api_live.FbjhjzG2NbN.IndO-X64NoGF8y4hKHSiInRX4hHabESp'
    }, {
        name: 'PORT',
        value: '3000'
    }]
})

svc.on('install', function() {
    svc.start()
})

svc.install()