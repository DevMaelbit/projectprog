const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Senhas não conferem.' });
    }

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já registrado.' });
        }

        const user = await User.create({ name, email, password });

        return res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao registrar o usuário.' });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.json({ token, message: 'Login bem-sucedido.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao realizar login.' });
    }
});

// Esqueci Minha Senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        // Gerar um token de redefinição de senha
        const token = crypto.randomBytes(20).toString('hex');

        // Definir o token e a data de expiração no usuário
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora a partir de agora

        await user.save();

        // Configurar o transporte de e-mail (usando o Nodemailer como exemplo)
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'anjosismael@outlook.com',
                pass: 'Icastro@101',
            },
        });

        const mailOptions = {
            to: user.email,
            from: 'anjosismael@outlook.com',
            subject: 'Redefinição de Senha',
            text: `Você está recebendo este e-mail porque solicitou a redefinição de senha para sua conta.\n\n` +
                `Clique no link a seguir ou cole-o no seu navegador para concluir o processo:\n\n` +
                `http://localhost:3000/reset-password/${token}\n\n` +
                `Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.\n`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Link de redefinição enviado para o e-mail.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao processar a solicitação.' });
    }
});


module.exports = router;
