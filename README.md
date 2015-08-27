# Github Scrum Board

This is really all just me screwing around to learn Backbone.js.

Currently, the server for the backend doesn't actually interface with the GH api. Instead, the data loaded is just downloaded from this repo's issue queue and stored as `json` files.

### To install / test:

```shell
git clone https://github.com/shawnrice/gh-scrum-board.git
cd gh-scrum-board
npm install
cd site
bower install
cd ..
node server.js
open http://localhost:4711
```