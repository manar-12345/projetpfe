// calculationRoute.js
const express = require('express');
const router = express.Router();
const { Datafile } = require('../models/dataFile'); // Assurez-vous d'importer les modèles correctement
const { Wireslists } = require('../models/WireslistModel'); // Assurez-vous d'importer les modèles correctement

// Route GET pour récupérer les données de calcul
router.get('/', async (req, res) => {
  try {
    // Utiliser la méthode findAll() pour récupérer toutes les données de calcul
    const calculationData = await Wireslists.findAll({
      include: Datafile // Inclure les données de la table Datafile dans les résultats
    });
    console.log('Data retrieved from the tables:', calculationData);
    res.json(calculationData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;