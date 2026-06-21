// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <--- IMPORTE O BCRYPT

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Use os nomes corretos do .env
        const { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET } = process.env;

        // Logs para depuração
        console.log('Username recebido:', username);
        console.log('ADMIN_USERNAME do .env:', ADMIN_USERNAME);
        console.log('ADMIN_PASSWORD do .env (hash):', ADMIN_PASSWORD);
        console.log(`Password recebido: ${password}`);

        // 1. Validar usuário
        if (username !== ADMIN_USERNAME) {
            console.log('Usuário inválido');
            return res.status(401).json({ message: "Usuário ou senha inválidos." });
        }

        // 2. Validar senha com BCRYPT
        const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD);

        if (!isPasswordValid) {
            console.log('Senha inválida');
            return res.status(401).json({ message: "Usuário ou senha inválidos." });
        }

        // 3. Gerar o Token
        const payload = {
            user: ADMIN_USERNAME,
            role: 'admin'
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '8h' } // Aumentei para 8h
        );

        res.status(200).json({
            message: "Login bem-sucedido!",
            token: token,
            cicd: "Deploy CI/CD verificado com sucesso no Render!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};