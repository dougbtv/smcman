#!/bin/bash
echo "Just clearing out chat and uploads...."
function clearCollection {
    mongo <<EOF
    use smcman
    db.chat.remove()
    db.uploads.remove()
EOF
}
clearCollection

echo "Now importing everything..."

mongoimport --db smcman --collection chat --file chat.json
mongoimport --db smcman --collection notes --file notes.json
mongoimport --db smcman --collection admins --file admins.json
mongoimport --db smcman --collection counters --file counters.json
mongoimport --db smcman --collection uploads --file uploads.json
mongoimport --db smcman --collection users --file users.json

