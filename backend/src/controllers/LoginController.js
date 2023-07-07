import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export default class LoginControler {

    static async fazerLogin(req, res) {
        const email = req.body.email;
        const senha = req.body.senha;

		if(!email || !senha) {
			return res.status(400).json({ error: true, message: "Preencha todos os campos" });
		}

        const usuario = await Usuario.fazerLogin(email,senha);

        if(usuario === false) {
			return res.status(400).json({ error: true, message: "Email ou senha incorretos" });
        }

        return res.status(200).json({
            token: jwt.sign(
                {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                },
                process.env.SECRET,
                {
                    expiresIn: process.env.EXPIREIN
                }
            ),
            usuario: usuario
        });
    }

}