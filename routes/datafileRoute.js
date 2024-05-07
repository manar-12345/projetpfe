const express = require('express');
const router = express.Router();
const { getAllDatafile } = require('../controllers/dataController');

router.get('/api/Datafile', async (req, res) => {
  try {
    const datafileData = await getAllDatafile();
    console.log('Data retrieved from the table:', datafileData);
    res.json(datafileData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;