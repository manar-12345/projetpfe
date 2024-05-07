// Importation des modules nécessaires
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Création d'une instance Sequelize avec les détails de connexion à votre base de données MySQL
const sequelize = new Sequelize('mysql://root:@localhost:3306/indus');

// Définition du modèle de la table Wireslists
const Wireslists = sequelize.define('Wireslists', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true // Pour que l'ID soit auto-incrémenté
  },
  LtgNr: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Kurzname1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Pin1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  xy1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kontakt1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Kurzname2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Pin2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  xy2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kontakt2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Sonderltg: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Innenleiter: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Longueur: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Farbe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Quer: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true, // Pour ajouter automatiquement les champs `createdAt` et `updatedAt`
  freezeTableName: true, // Pour empêcher Sequelize de modifier le nom de la table
  tableName: 'Wireslists' // Pour définir explicitement le nom de la table
});

// Fonction asynchrone pour créer la table dans la base de données
async function createWireslistsTable() {
  try {
    // Synchronise le modèle avec la base de données et crée la table si elle n'existe pas déjà
    await sequelize.sync();
    console.log("Table 'Wireslists' créée avec succès");
  } catch (err) {
    console.error("Erreur lors de la création de la table 'Wireslists':", err);
  }
}

// Appel de la fonction pour créer la table
createWireslistsTable().then(() => {
  // Configuration de l'application pour écouter le port spécifié
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
  
  // Exportation du modèle pour une utilisation ultérieure dans d'autres parties de l'application
  module.exports = { Wireslists };
});