const bCrypt = require('bcryptjs');

module.exports = {
  setPassword: (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  },

  validPassword: (eneteredPassword, dbPassword) => {
    return bCrypt.compareSync(eneteredPassword, dbPassword);
  }
};
