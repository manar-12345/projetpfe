const mysql = require('mysql');
const xlsx = require('xlsx');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const connection = mysql.createConnection(dbConfig);

const uploadFile = (req, res, fileType) => {
    // Vérification si un fichier a été téléchargé
    if (!req.file) {
        return res.status(400).send('Aucun fichier n\'a été téléchargé');
    }

    try {
        // Lecture du fichier téléchargé
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Extraction du nom de la table à partir du nom du fichier
        const tableName = req.file.originalname.split('.')[0];

        // Création de la requête CREATE TABLE pour créer une table dans la base de données
        let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

        // Construction des colonnes en fonction des propriétés du premier objet dans les données du fichier
        for (const key in data[0]) {
            if (data[0].hasOwnProperty(key)) {
                const columnName = key.replace(/\s+/g, '_').replace(/^\d/, 'col$&');
                createTableQuery += `\`${columnName}\` VARCHAR(255), `;
            }
        }

        createTableQuery = createTableQuery.slice(0, -2);
        createTableQuery += ')';

        // Exécution de la requête CREATE TABLE
        connection.query(createTableQuery, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table:', err);
                return res.status(500).send('Erreur lors de la création de la table');
            }

            // Création de la requête INSERT pour insérer les données dans la table
            const insertQuery = `INSERT INTO ${tableName} (${Object.keys(data[0]).map(columnName => `\`${columnName}\``).join(',')}) VALUES ?`;

            // Exécution de la requête INSERT
            connection.query(insertQuery, [data.map(obj => Object.values(obj))], (err) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion des données:', err);
                    return res.status(500).send('Erreur lors de l\'insertion des données');
                }
                res.send('Fichier téléchargé et données insérées avec succès');
            });
        });
    } catch (error) {
        console.error('Erreur lors du traitement du fichier:', error);
        res.status(500).send('Erreur lors du traitement du fichier');
    }
};

module.exports = {
    uploadFile
};
