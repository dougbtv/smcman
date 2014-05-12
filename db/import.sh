#!/bin/bash
echo "Just clearing out chat...."
mongo --eval "use smcman; db.chat.remove();"

mongoimport --db smcman --collection chat --file chat.json
mongoimport --db smcman --collection notes --file notes.json
mongoimport --db smcman --collection admins --file admins.json
mongoimport --db smcman --collection counters --file counters.json
mongoimport --db smcman --collection uploads --file uploads.json

