# Development setup

```
    npm install -g grunt-cli
    npm install -g bower
    npm install
    bower install
```

# Configuring the proxy

You will need to specify the host and port of your fleet API. The grunt-connect tak will use environment variables to set up the proxy.

The easiest way is to set the variables ```FLEET_HOST``` and ```FLEET_PORT```. The default values are ```localhost``` and ```80``` respectively.
```
    export FLEET_HOST="10.10.10.10"
    export FLEET_PORT="80"
    grunt serve
```

If you wish to proxy without using the grunt-connect task, you should know that
the application will interface with ```/api``` for all fleet API requests.

# Running the server

## Development
```grunt serve```

## Production
```grunt serve:dist```

# Building the application
```grunt dist``` will produce a ```fleet-ui.tar.gz``` package.
