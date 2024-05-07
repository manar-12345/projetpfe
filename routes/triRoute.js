const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const mysql = require('mysql');

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Mettez le mot de passe de votre base de données ici
  database: 'indus'
});

// Middleware pour gérer l'importation de fichiers
const upload = multer({ dest: 'uploads/' });

// Fonction pour gérer l'importation du fichier Excel dans la table wireslists
const importExcelToWireslists = (req, res) => {
  // Vérifiez si un fichier a été téléchargé
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Lire le fichier Excel téléchargé
  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const excelData = XLSX.utils.sheet_to_json(worksheet);

  // Insérer les données dans la table wireslists
  const sql = 'INSERT INTO wireslists (LtgNr, Kurzname1, Pin1, xy1, kontakt1, Kurzname2, Pin2, xy2, kontakt2, Sonderltg, Innenleiter, Longueur, Farbe, Quer) VALUES ?';
  const values = excelData.map(row => [row.LtgNr, row.Kurzname1, row.Pin1, row.xy1, row.kontakt1, row.Kurzname2, row.Pin2, row.xy2, row.kontakt2, row.Sonderltg, row.Innenleiter, row.Longueur, row.Farbe, row.Quer]);

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting data into wireslists:', err);
      return res.status(500).json({ error: 'Error inserting data into wireslists' });
    }
    console.log('Data inserted into wireslists');
    res.status(200).json({ message: 'Data inserted into wireslists successfully' });
  });
};

// Définir la route pour gérer l'importation du fichier Excel vers la table wireslists
router.post('/import-excel-to-wireslists', upload.single('file'), importExcelToWireslists);

// Exportez le routeur pour l'utiliser dans votre application
module.exports = router;