#!/bin/bash
mongoexport --db smcman --collection chat --out chat.json
mongoexport --db smcman --collection notes --out notes.json 
mongoexport --db smcman --collection admins --out admins.json 
mongoexport --db smcman --collection counters --file counters.json
mongoexport --db smcman --collection uploads --file uploads.json


