db = connect("mongodb://localhost:27017/restaurant");

const data = require('/docker-entrypoint-initdb.d/recipen.json');

db.recipes.insertMany(data);
