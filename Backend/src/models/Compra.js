const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Compra = sequelize.define('Compra', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    preco: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: false
    }
}, {
    tableName: 'compra',
    timestamps: true
})

// RELACIONAMENTOS
User.hasMany(Compra, { foreignKey: 'id_usuario', as: 'compra'});
Compra.belongsTo(User, { foreignKey: 'id_usuario', as: 'usuario'});

module.exports = Compra;