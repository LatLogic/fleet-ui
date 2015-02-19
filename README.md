# Development setup

## PyCharm

### Install PyCharm plug-ins

1. Go to *Settings... > Plugins*
2. Click **Browse repositories...**
3. Search for and install the following: NodeJS, Karma

### Enable JSHint code quality tool

1. Go to *Settings... > Languages & Frameworks > Javascript > Code Quality Tools > JSHint*
2. Make sure **Enable** is checked
3. Make sure **Use config files** is checked and **Default** option (.jshintrc) is selected

## Install node/npm

Install node with npm

    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get install build-essential
    npm config set prefix ~/.npm-packages
    
Update npm itself

    npm install -g npm

Add the following to your `~/.bashrc` file

    NPM_PACKAGES="~/.npm-packages"
    NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
    PATH="./node_modules/.bin:$NPM_PACKAGES/bin:$PATH"

Update the environment

    source ~/.bashrc
    
Make sure you have npm version 2.5.x or later

    npm --version

## Install Yeoman and supporting packages

    npm install -g yo bower grunt-cli
    npm install -g generator-angular

# How this project was generated

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

Generate angular scaffolding (answer yes for all sass and bootstrap options):

    yo angular
    
Add karma test runner:

    yo karma

Install less support for grunt:

    npm install grunt-contrib-less --save-dev
    
Remove compass:

    npm uninstall grunt-contrib-compass --save-dev
    bower uninstall bootstrap-sass-official --save
    
Replace with less for bootstrap
 
    bower install bootstrap --save

Modified `Gruntfile.js` to use a less target instead of sass:

    less: {
        dist: {
            options: {
                compress: true
            },
            files: {
                '.tmp/styles/app.css': [
                    '<%= yeoman.app %>/**/*.less'
                ]
            }
        },
        server: {
            options: {
                sourceMap: true
            },
            files: {
                '.tmp/styles/app.css': [
                    '<%= yeoman.app %>/**/*.less'
                ]
            }
        }
    },

Anywhere compass or sass is used, replace with less equivalent

Changed all file patterns from `styles/{,*/}*.{scss,sass}` to `**/*.less` in order to find nested styles

Make following changes to `karma.conf.js`:

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // list of files / patterns to load in the browser
    files: [
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-touch/angular-touch.js',
        'app/scripts/**/*.js',
        'test/spec/**/*.js'
    ],

    // web server port
    port: 9080,
    
Added globals for jasmine to .jshintrc

    "globals": {
        ...
        "afterEach": false,
        "beforeEach": false,
        "describe": false,
        "it": false,
        "expect": false
    }
