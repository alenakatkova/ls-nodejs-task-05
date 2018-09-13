const bCrypt = require('bcryptjs');

const saltRounds = 10;

module.exports = {
  setPassword: (password) => {
    return bCrypt.hash(password, saltRounds);
  },

  validPassword: (enteredPassword, dbPassword) => {
    return bCrypt.compareSync(enteredPassword, dbPassword);
  }
};
