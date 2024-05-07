require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const multer = require('multer');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const comparerFichiersExcel = require('./controllers/excelComparer'); // Import de la fonction de comparaison

const userRoute = require('./routes/userRoute');
const triRoute = require('./routes/triRoute');
const datafileRoute = require('./routes/datafileRoute');
const calculationRoute = require('./routes/calculationRoute');

const port = 5000;
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://accounts.google.com/gsi/client"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", userRoute);
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use("/api/wireslists", triRoute);
app.use("/api/Datafile", datafileRoute);
app.use("/api/calculation", calculationRoute);

// MySQL Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    // Envoyer une réponse d'erreur appropriée
    return res.status(500).send('Error connecting to MySQL');
  }
  console.log('Connected to MySQL database');
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route pour gérer le téléchargement de fichiers
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  const tableName = req.file.originalname.split('.')[0];
  let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

  for (const key in data[0]) {
    if (data[0].hasOwnProperty(key)) {
      const columnName = key.replace(/\s+/g, '_').replace(/^\d/, 'col$&');
      createTableQuery += `\`${key}\` VARCHAR(255)`;

      createTableQuery += ` NULL ,`;
    }
  }

  createTableQuery = createTableQuery.slice(0, -2);
  createTableQuery += ')';

  connection.query(createTableQuery, async (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return res.status(500).send('Error creating table');
    }

    // Comparaison des fichiers Excel après l'insertion des données
    try {
      await comparerFichiersExcel('./oldwirelist.xlsx', './newwirelist.xlsx', './differences.xlsx');
    } catch (error) {
      console.error('Erreur lors de la comparaison des fichiers Excel :', error);
      return res.status(500).send('Erreur lors de la comparaison des fichiers Excel');
    }

    const columns = Object.keys(data[0]);
    const insertColumns = columns.map(columnName => `\`${columnName}\``).join(',');
    const placeholderValues = '(' + columns.map(() => '?').join(',') + ')';
    const insertQuery = `INSERT INTO ${tableName} (${insertColumns}) VALUES ${placeholderValues}`;

    const insertValues = data.map(obj => {
      return columns.map(column => {
        if (obj[column] === undefined || obj[column] === null) {
          return null;
        } else {
          return obj[column];
        }
      });
    });

    insertValues.forEach(innerArray => {
      connection.query(insertQuery, innerArray, (err) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Error inserting data');
        }
      });
    });
    res.send('File uploaded, data inserted, and Excel files compared successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
