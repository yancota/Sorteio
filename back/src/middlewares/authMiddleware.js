// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Pega o segredo do .env

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido." });
        }

        // Formato esperado: "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: "Formato de token inválido." });
        }

        const token = parts[1];

        // Verifica se o token é válido
        const decoded = jwt.verify(token, JWT_SECRET);

        // Adiciona os dados do token ao 'req' (opcional, mas útil)
        req.user = decoded;

        // Permite o acesso à rota
        next();

    } catch (error) {
        // Se jwt.verify falhar (expirado, assinatura inválida, etc.)
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};