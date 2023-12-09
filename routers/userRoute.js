const { getActiveUser, createUser, getAllUsers, getUserById, updateUserById, deleteUserById } = require("../controllers/userController");

module.exports = (router) => {
  router.post("/users", createUser);
  router.get("/users", getAllUsers);
  router.get("/users/:id", getUserById);
  router.put("/users/:id", updateUserById);
  router.delete("/users/:id", deleteUserById);
};
