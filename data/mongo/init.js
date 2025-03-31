db = connect("mongodb://localhost:27017/restaurant");

const fs = require("fs");
const path = "/docker-entrypoint-initdb.d/recipes.json";

const data = JSON.parse(fs.readFileSync(path, "utf8"));

db.recipes.insertMany(data);
