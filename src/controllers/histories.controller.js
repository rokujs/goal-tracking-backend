const History = require('../models/History')

const historyCtrl = {}

historyCtrl.addNewHistory = (req, res) => {

}

historyCtrl.getSingleHistory = async (req, res) => {
  const history = await History.findById(req.params.id)

  res.json(history)
}

module.exports = historyCtrl
