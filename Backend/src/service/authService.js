const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (RA, senha, ultimoAcesso) => {

    const user = await User.findOne({ where: { RA } });
    if (!user) return null;

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return null;

    const token = jwt.sign(
        {
            id: user.id, nome: user.nome, email: user.email, role: user.role,
            status: user.status, mensagemBloqueio: user.mensagemBloqueio
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );

    await user.update({ ultimoAcesso: ultimoAcesso });

    return token;
};

module.exports = { login };