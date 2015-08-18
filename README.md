# Development setup

```
    npm install -g grunt-cli
    npm install -g bower
    npm install
    bower install
```

# Configuring the proxy

You will need a proxy to the machine hosting your fleet API. 

The application will interface with ```/api```.

Example using grunt-connect-proxy in ```Gruntfile.js```:

```
    ...
    connect: {
        ...
        proxies: [{
            context: '/api',
            host: '10.10.10.10',
            port: 80,
            https: false,
            xforward: false,
            headers: {
                host: '10.10.10.10'
            }
        }],
        ...
    }
```
