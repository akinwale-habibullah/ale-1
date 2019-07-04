# ThriftBox
ThriftBox is a cooperative management application based on node.js + Sequelize

The accounting backend is based on the Ale application insipred by [Medici](https://github.com/koresar/medici) and further developed by [CjS77](https://github.com/CjS77/ale)

## Standalone Server
ThriftBox operates as a standalone microservice.

Configure the application as described below and simply run 

`$ node server.js`

to launch a REST server to handle all your double-entry accounting needs. 
You can peruse the [API documentation](https://olajide1234.github.io/ale/) for more details on how to use the service.


## Description

ThriftBox divides itself into "books", each of which store *journal entries* and their child *transactions*. The cardinal rule of double-entry accounting is that "everything must balance out to zero", and that rule is applied to every journal entry written to the book. If the transactions for a journal entry do not balance out to zero, the system will return a rejected promise.

Books simply represent the physical book in which you would record your transactions - on a technical level, the "book" attribute simply is added as a field in `Transactions` and `JournalEntry` tables to allow you to have multiple books if you want to.

Each transaction in ThriftBox operates on a single *account*. 

## Configuration

ThriftBox tries to be agnostic as to which RDMS you have running on the back-end. Therefore, you need to ensure that the relevant DB bindings are installed and part of your `package.json` file.

For PostgreSQL, this would entail

`yarn add pg`

You *must* set an `ALE_CONNECTION` environment variable which holds the connection string to connect to the underlying database. To date, ThriftBox has been tested against PostgreSQL, but any DB supported by Sequelize (SQLite, MySQL etc) should work.

- Configure your .env file to follow the sample below
```
ALE_CONNECTION=postgres://smmvndghq:DJvTv_LIzn1J5244-z5a0TiZvfT2pC7wxg@manny.db.elephantsql.com:5432/smmvndhggq 
TEST_ALE_CONNECTION=postgres://wcfhhujiuytk:K1a6OkaZBceVQvjhghghgNKQBS1BbC6u-ltRjXH@raja.db.elephantsql.com:5432/wcfhhujjjhhk
ALE_PORT=5000
ALE_DEBUG=true
SECRET=olajide

```
- Run `yarn install` to install all packages required
- Run `yarn start` to start the server

## Changelog
* **v1.0.0** REST API release
