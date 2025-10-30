// middleware/checkRole.js

// Este é um "factory function"
// Ele retorna uma função de middleware
// Isso nos permite reutilizá-lo para diferentes roles (ex: 'admin', 'user', 'moderator')
const checkRole = (roleNecessaria) => {
    return (req, res, next) => {
        // Nós esperamos que o 'authMiddleware' já tenha rodado
        // e colocado os dados do token em 'req.user'
        if (!req.user || req.user.role !== roleNecessaria) {
            return res.status(403).json({
                message: "Acesso negado. Você não tem permissão de administrador."
            });
        }

        // Se req.user.role for 'admin', ele passa
        next();
    };
};

module.exports = checkRole;