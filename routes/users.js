const express = require('express');

const router = express.Router();

const {
    getUser,
    createUser,
    login,
    updateUser,
    deleteUser,
    getAllUsers, 
    getUserByEmail
  } = require('../controllers/users');

  router.route('/').post(createUser);

  router.route('/login').post(login);

  router.route('/:id')
  .get(getUser)
  .put(updateUser) 
  .delete(deleteUser);

  router.route('/email/:email')
  .get(getUserByEmail);


  module.exports = router;