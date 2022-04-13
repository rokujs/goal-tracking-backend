const path = require('path')

const otherCtrl = {}

// GET /home
otherCtrl.home = async (req, res) => {
  res.sendFile(path.join(__dirname, '../views/home.html'))
}

module.exports = otherCtrl
