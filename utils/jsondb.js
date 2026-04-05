const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "db.json");

class JsonDB {
  constructor() {
    this.data = {};
    if (fs.existsSync(DB_PATH)) {
      try {
        this.data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
      } catch {
        this.data = {};
      }
    }
  }

  _save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  get(key) {
    return this.data[key] !== undefined ? this.data[key] : null;
  }

  set(key, value) {
    this.data[key] = value;
    this._save();
    return value;
  }

  delete(key) {
    const existed = key in this.data;
    delete this.data[key];
    this._save();
    return existed;
  }

  all() {
    return Object.entries(this.data).map(([ID, data]) => ({ ID, data }));
  }
}

module.exports = new JsonDB();
