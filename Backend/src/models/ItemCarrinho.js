const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Usuario = require('./User');
const Produto = require('./Produto');

const ItemCarrinho = sequelize.define('ItemCarrinho', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produto,
            key: 'id'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'item_carrinho',
    timestamps: true
})

Usuario.hasMany(ItemCarrinho, { foreignKey: 'id_usuario', as: 'carrinho_usuario' });
ItemCarrinho.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario_carrinho' });

Produto.hasMany(ItemCarrinho, { foreignKey: 'id_produto', as: 'carrinho_produto' });
ItemCarrinho.belongsTo(Produto, { foreignKey: 'id_produto', as: 'produto_carrinho' });

module.exports = ItemCarrinho;

