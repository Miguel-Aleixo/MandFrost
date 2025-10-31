const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const TipoProduto = require('./TipoProduto');

const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_tipo_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoProduto,
            key: 'id',
        }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: false,
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imagem_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'produtos',
    timestamps: true
});

TipoProduto.hasMany(Produto, { foreignKey: 'id_tipo_produto', as: 'produtos' });
Produto.belongsTo(TipoProduto, { foreignKey: 'id_tipo_produto', as: 'tipo_produto'})

module.exports = Produto;