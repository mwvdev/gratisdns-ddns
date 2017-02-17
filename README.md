GratisDNS DDNS updater
=====================
A NodeJS application that updates DDNS at GratisDNS with the network's current external IP.

## Requirements

* [Node](https://nodejs.org)

## How to run

Use [config.js](config.js) to customize endpoints if necessary.

Install dependencies using:

``` bash
$ npm install
```

Run using:

``` bash
$ node gratisdns <username> <password> <domain> <hostname>
```