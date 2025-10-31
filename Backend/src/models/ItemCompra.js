const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const Produto = require('./Produto');
const Compra = require('./Compra');

const ItemCompra = sequelize.define('ItemCompra', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produto,
            key: 'id'
        }
    },
    id_compra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Compra,
            key: 'id'
        }
    },
    preco: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
}, {
    tableName: 'item_compra',
    timestamps: true
});

// RELACIONAMENTOS
Produto.hasMany(ItemCompra, { foreignKey: 'id_produto', as: 'item_compra'});
ItemCompra.belongsTo(Produto, { foreignKey: 'id_produto', as: 'produto'})

Compra.hasMany(ItemCompra, { foreignKey: 'id_compra', as: 'item_compra'});
ItemCompra.belongsTo(Compra, { foreignKey: 'id_compra', as: 'compra'});

module.exports = ItemCompra;