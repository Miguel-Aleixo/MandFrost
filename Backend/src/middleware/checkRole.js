const jwt = require('jsonwebtoken');

function CheckRole(rolesPermitidas) {
    return (req, res, next) => {
        try {

            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Token não fornecido' });
            }

            const payload = jwt.verify(token, process.env.JWT_SECRET);

            const roleEnviada = String(payload.role || '');

            const rolesNormalizadas = rolesPermitidas.map(r => String(r).toUpperCase());

            if (!rolesNormalizadas.includes(roleEnviada)) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    }
};

module.exports = CheckRole;