"user strict";
var sql = require("../Config/db.config");

module.exports = {
 
  queryDb: function (query, param) {
    return new Promise((resolve) => {
      sql.query(query, param, (err, result) => {
        if (err) {
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
};
