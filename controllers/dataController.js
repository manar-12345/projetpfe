const { Sequelize, DataTypes } = require('sequelize');
const { Datafile } = require('../models/dataFile'); // Import the Datafile model
const sequelize = new Sequelize('mysql://root:@localhost:3306/indus');

// Récupérer toutes les entrées de la table Datafile
async function getAllDatafile() {
  try {
    const entries = await Datafile.findAll();
    return entries;
  } catch (err) {
    console.error('Error retrieving data:', err);
    throw err;
  }
}

module.exports = {
  getAllDatafile
};