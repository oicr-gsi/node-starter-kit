# Node Starter Kit
This is intended to be a basic set of files and packages for use with any new 
OICR GSI Node project. API projects have an additional set of recommendations
and best practices, available in the `api` branch.

## License
We use MIT by default. Always check your dependencies to see if they use an 
incompatible license. BSD-3-Clause, BSD-2-Clause, and Apache 2.0 are all 
compatible; GPL-3 and other viral/copyleft licenses may cause problems if you 
want to make your project closed-source, or to others who want to use your 
project in their own closed-source project. This is a vast oversimplification 
and more comprehensive explanations exist on the internet.

## Getting Started
Clone the project, then rename it and set a new upstream repository named _YourProject_ (replace with your project's name).
```bash
$ git clone git@github.com:oicr-gsi/node-starter-kit.git
$ mv node-starter-kit YourProject
$ cd YourProject
$ git remote -v # view current remotes
$ git remote rm origin
```
Create a new GitHub repository named YourProject. Do not initialize the repository with a README or a license. Now follow the instructions to push an existing repository from the command line
```bash
$ git remote add origin git@github.com:oicr-gsi/YourProject.git
$ git push -u origin master
```
Install packages, and update any outdated packages:
```bash
$ npm install --local
$ npm outdated # see if anything needs to be updated
$ npm update # if anything needs to be updated
```
At this point you can delete or rename this README and replace it with one more relevant to your project.

## Dotenv
[Dotenv](https://github.com/motdotla/dotenv) takes the variables you've declared 
in a `.env` file and loads them into `process.env`. It will not overwrite any variables which are already declared in the environment.

### Usage
"As early as possible in your application, require and configure dotenv."
```javascript
require('dotenv').config()
```
If you've got a line like `VAR_1=` in your `.env` file, you can then access it as 
`process.env.VAR_1`.

## ESLint
[ESLint](https://eslint.org/) is an automated linter. It's included here to keep 
you from accidentally shooting yourself in the foot. This repo's settings (in 
`.eslintrc`) are based off of Prettier's default settings (see section below). 
The additional settings are aimed at ES6 and also ensure that it will error on 
any uses of `var` (use `let` or `const` instead), as well as erroring if any
undefined variables are used.

Note that these default settings assume that your JavaScript is not targeting 
the browser. If this is not the case, change `env.browser` to `true`.

### Usage
```
npm run lint
```

## Prettier
[Prettier](https://prettier.io/) is an opinionated code formatter. It's included 
here to avoid formatting bikeshedding and to minimize unnecessary code diffs. It 
will run through your code and automatically format it. The settings in 
`.prettierrc` only vary from the default Prettier settings in that they will 
cause Prettier to use single quotes instead of double quotes. This is _a_ set of standards, not _the_ set of standards; if you feel strongly about single quotes vs. double quotes or other choices Prettier has made, go ahead and change them in `.prettierrc`.

### Usage
Runs automatically on commit. To run manually:
```
npm run prettier
```

## Husky
[Husky](https://github.com/typicode/husky) automatically runs commands on each 
`git commit` and `git push`. It's included here because I am unlikely to 
remember to run Prettier before each commit, so Husky will do it for me. These 
default settings (in `package.json`) will run Prettier before each commit, and 
will run tests before each push.

### Usage
```
git commit
git push
```

## Continuous Integration testing

To run this project through TravisCI, update `.travis.yml` with the appropriate 
code to run your tests. 

First, go to the [TravisCI](https://travis-ci.org/profile/) page. Click on the 
`+` button next to `My Repositories` in the left menu bar. Find your new project 
on this page and enable TravisCI. (Note: the repository must be public in order 
for this to run on travis-ci.org)

### Vulnerable dependencies assessment
The included `.travis.yml` file includes a command `snyk test` which uses Snyk 
to assess your dependencies for known vulnerabilities. In order to run `snyk
test` you will have to first sign up for a [Snyk account](https://snyk.io/), 
copy your Snyk token from your account page, and update your Travis build 
settings with an environment variable with the name `SNYK_TOKEN` and paste in 
your token. (See [this blog 
post](https://blog.travis-ci.com/2017-04-20-continuous-security-snyk-travis-ci/) 
for more details on running Snyk on TravisCI.)
If Snyk finds vulnerable dependencies, the build will fail and you'll have to fix
them manually using Snyk on the command line, which will walk you through 
options for fixing the vulnerabilities.
```
  npm install -g snyk
  cd "${MY_PROJECT_PATH}"
  snyk test
```

### Linting
Travis can do a run through your ESLint settings as well. In the `script` 
section, add `npm run lint`

### Your test suite
In the `script` section, add `npm run test`.

# Suggestions
## Mocha
[Mocha](https://mochajs.org/) is a test framework for JavaScript. It will find 
your tests and run them.
### Usage
Change `scripts.test` in `package.json` to `mocha --exit`.

## Chai
[Chai](http://chaijs.com/) is a useful test assertion language that has both TDD and 
BDD syntax. 
### Usage
Require it in your test file, and use it.

# APIs
If you're writing an API, chances are good that you'll need a server and maybe
even a database. Here are some recommendations:

## Server: Express
[Express](http://expressjs.com/) is a mature, fast, unopinionated, minimalist
web framework. See `server.js` for an example setup that makes use of the other
packages in this project. It is usually the `main`file in your `package.json` if a
server is your project's main goal.

## Logging: Winston
[Winston](https://github.com/winstonjs/winston) allows multiple loggers (error,
info, etc.) to be active at the same time, with custom formatting for each.
They're all output as JSON, which is nice for machine parsing. See
`utils/logger.js` for an example setup which will print separate logs for
info-and-more-severe, error-and-more-severe, and if it's not a production
environment, debug-and-more-severe.

## Monitoring: Prometheus
[Prom-client](https://github.com/siimon/prom-client) is a Prometheus client for
Node. See `utils/prometheus.js` for an example file for a server.

## Security: Helmet
[Helmet](https://helmetjs.github.io/) helps you secure your Express app. Note
the "helps"; [OWASP](https://www.owasp.org/index.php/Getting_Started) has lots of
information about web security too.
### Usage
See `server.js`

## Allowing requests from other domains: CORS
[CORS](https://github.com/expressjs/cors) is a package to enable CORS on your
Express app, so that other websites can request data from your server.
### Usage
See `server.js`

## Reading data from a request body: Body-Parser
[body-parser](https://github.com/expressjs/body-parser) allows your Express app
to read simple request bodies. It does not handle multi-part request bodies.
### Usage
See `server.js`

## Assigning a UID to each request: UUID
[UUID](https://github.com/kelektiv/node-uuid) allows you to generate UUIDs to
assign to each request. If you're using multiple services for a single request
and something goes wrong, it helps with debugging.
### Usage
See `server.js`

## Documentation: Swagger-JSDoc
[Swagger-JSDoc](https://github.com/Surnet/swagger-jsdoc) allows you to either
generate Swagger from JSDoc code, or to write blocks of Swagger (OpenAPI)
documentation above each method. I find this to be preferable to something like
Swagger-UI-Express which requires you to put all of your documentation into one
YAML file, but your mileage may vary.
### Usage
TODO...

## Database Migrations: Flyway
The [flywaydb-cli](https://www.npmjs.com/package/flywaydb-cli) package is a
wrapper around Flyway, which allows you to apply and track database migrations
for multiple database types. You'll want to go to the
[Flyway](https://flywaydb.org/documentation/) documentation for usage and
debugging.
### Usage
Primarily used via `script` commands in `package.json`.
```
"scripts": {
  "fw:migrate": 
    "node_modules/flywaydb-cli/lib/flyway-4.2.0/flyway -X -configFile=conf/flyway.conf migrate"
}
```
See https://www.npmjs.com/package/flywaydb-cli for additional usage examples.

## PostgreSQL Database Interface: pg-promise
The [pg-promise](https://www.npmjs.com/package/pg-promise) package provides a
Promise-based interface for PostgreSQL.
### Usage
```javascript
const pgp = require('pg-promise')({optionsObj});
const pg = pgp(process.env.DB_CONNECTION);
pg.any(SQL)
  .then(data => {})
  .catch(err => {});
```
