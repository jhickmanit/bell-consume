# Bell-Consume

Bell-Consume is a demo project using Onfido & Okta APIs with OIDC

## Requirements

Node 13.12.0
npm

## Environment Variables

The following env needs to be set for the project to run and demo:

1. **APP_URL** = This is the URL the app will run on. Typically http://localhost:3000/. If you update the PORT env, be sure to update the port on the URL here.
2. **OIDC_DISCOVER** = This is the OIDC .well-known discovery endpoint provided by Okta.
3. **OIDC_CALLBACK** = This is the app callback URL for the response from Okta. This should be the same as the APP_URL with the addition of "/cb" to the path. For example: http://localhost:3000/cb
4. **OIDC_CLIENT_ID** = This is the OIDC client ID provided by Okta's OIDC settings.
5. **OIDC_CLIENT_SECRET** = This is the OIDC client secret provided by Okta's OIDC settings.
6. **SESSION_SECRET** = This is an arbitrary secret for encrypting session state cookie.
7. **ONFIDO_API_TOKEN** = This is the Onfido API Token.
8. **PORT** = This is the port that the web service will run on. 

For running as a Windows Service, these values need to be updated in the OnfidoDemoService-Install.js and OnfidoDemoService-Uninstall.js

For running directly from node, an .env file should be created in the root of the project directory.

## Building

In the root of the project directory run the following command:

```shell
npm install -g node-windows
npm install
npm link node-windows
npm run build
```

This will create a dist-server folder in the root directory and add a package for running the solution as a windows service.

## Installing as a Windows Service

Included in the project is a wrapper to run this project as a Windows Service.

To install the service, run the following command from the root of the project directory:

```shell
node ./OnfidoDemoService-Install.js
```

## Uninstalling the Windows Service

To uninstall the service, run the following command from the root of the project directory:

```shell
node ./OnfidoDemoService-Uninstall.js
```


## Running without Windows Service

To run without installing as a Windows Service, from the root of the project directory, run the following command:

```shell
npm run prod
```
or

```shell
npm run dev
```

Depending on the environment type.

## Known Issues

On the first load of the integration, you may get an error on the GET / operation. I have yet to resolve this issue as it has to do with OIDC discovery and creating the initial session.
### Workaround

Simply refresh the page and the project will load as intended.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)