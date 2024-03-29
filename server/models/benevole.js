"use strict";

module.exports = function(sequelize, DataTypes) {
  var Benevole = sequelize.define("Benevole", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
    prenom: {
      type: DataTypes.STRING,
    },
    nom: {
      type: DataTypes.STRING,
    },
    enfants: {
      type: DataTypes.STRING,
    },
    classes: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    commentaire: {
      type: DataTypes.STRING,
    },
    reponse: {
      type: DataTypes.STRING,
    },
    gateaux: {
      type: DataTypes.STRING,
    },
  });
  Benevole.associate = function(models) {

    models.Benevole.belongsToMany( models.Croisement, {
      through: {
        model: models.ResaBenevoles,
        unique: false
      },
      foreignKey: 'benevole'
  });

  };
  return Benevole;
};
