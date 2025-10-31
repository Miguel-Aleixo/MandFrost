const authService = require('../service/authService');

const login = async (req, res, next) => {
    try {
        const { RA, senha, ultimoAcesso } = req.body;

        if (!RA || !senha) {
            return res.status(400).json({ message: 'Preencha corretamente os campos!' });
        };

        const token = await authService.login(RA, senha, ultimoAcesso);

        if (!token) {
            return res.status(401).json({ message: 'RA ou senha invalidos' });
        };
        
        res.json({ token: token });
    } catch (err) {
        next(err);
    }
};

module.exports = { login };