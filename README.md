SMCMAN - an IRC bot who officiates speed modeling challenges
---

More about text! This bot is awesome.

---
**Requirements**

Requires mongodb.

Requires extra node modules:
- irc
- exec-sync
- moment
- mongoose

Requires internal (should come with your node) modules:
- fs

---
**Install**

Firstly, copy the file "config_private.js" to "config_private_mine.js" and (optionally) add to svn ignore.

    [user@host]$ cp config_private.js config_private_mine.js
    [user@host]$ svn propset svn:ignore config_private_mine.js .

Secondly, you should be able to get the modules you need right in this cwd with npm, 

    [user@host]$ npm install

It should read from the package.json included here.

Or install the packages manually. ("npm install module-name" for each required module)

You'll want to import the mongo db's (you can find the original json files in the db/ directory)

    mongoimport --db smcman --collection chat --file chat.json
    mongoimport --db smcman --collection notes --file notes.json


To export the mongo db's

    mongoexport --db smcman --collection chat --out chat.json
    mongoexport --db smcman --collection notes --out notes.json 

---
**Basic Usage**

- irc_config.js

This is where the bulk of your setup will happen. 

---
**Asterisk Setup**
