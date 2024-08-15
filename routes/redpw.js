// Redefinir Senha
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [Op.gt]: Date.now(), // Verifica se o token ainda é válido
                },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        // Atualizar a senha
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Limpar os campos de token de redefinição de senha
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao redefinir a senha.' });
    }
});
