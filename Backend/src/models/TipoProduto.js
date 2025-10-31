const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TipoProduto = sequelize.define('TipoProduto', {
    id: {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    imagem_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'tipo_produto',
    timestamps: true,
}
);

module.exports = TipoProduto;