const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with database connection
const sequelize = new Sequelize('mysql://root:@localhost:3306/indus');

// Define the Datafile model without 'id' column
const Datafile = sequelize.define('Datafile', {
  Kaufteil1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Distchung1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Codeleoni1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Kaufteil2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Distchung2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Codeleoni2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Grommet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Coiling: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Cover: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Close: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Kabelbinder: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Tape: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clips: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Variant: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Tools: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true,
  // Define the table name explicitly
  tableName: 'Datafiles',
});

// Synchronize the model with the database
(async () => {
  try {
    await Datafile.sync({ force: true }); // Create the table if it doesn't exist
    console.log("Table 'Datafiles' created successfully");
  } catch (err) {
    console.error("Error creating table 'Datafiles':", err);
  }
})();

module.exports = {
  Datafile // Export the Datafile model
};