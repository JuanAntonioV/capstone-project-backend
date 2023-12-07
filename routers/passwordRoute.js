const { updateUserPassword } = require("../controllers/passwordController");

module.exports = (router) => {
  router.put("/users/:id/password", updateUserPassword);
};
