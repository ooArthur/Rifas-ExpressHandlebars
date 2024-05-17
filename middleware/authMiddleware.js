const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token;

    if (authHeader) {
        token = authHeader.split(' ')[1]; // Pega a segunda parte após 'Bearer'
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ error: "Acesso negado, token não fornecido" });
    }

    jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }

        // Verifica se o token fornecido é igual ao token gerado
        const generatedToken = jwt.sign({ userId: decodedToken.userId }, process.env.JWTSECRET);
        if (token !== generatedToken) {
            return res.status(403).json({ error: "Token inválido" });
        }

        // Adiciona as informações do usuário na requisição
        req.user = decodedToken;
        next();
    });
}

module.exports = authenticateToken;
