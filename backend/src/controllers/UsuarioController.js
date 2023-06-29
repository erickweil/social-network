import usuarios from "../models/Usuario.js";
import mongoose from "mongoose";

export default class UsuarioControler {
	static async listarUsuarios(req,res) {
		const lista = await usuarios.find({});
		return res.status(200).json(lista);
	}
	
	static async listarUsuarioPorId(req,res) {
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });
	
		const usuario = await usuarios.findById(id);
		if(!usuario)
			return res.status(404).json({ error: true, message: "Usuário não encontrado" });
	
		return res.status(200).json(usuario);
	}
	
	static async cadastrarUsuario(req,res) {
		try {
			const nome = req.body.nome;
			const email = req.body.email;
			const senha = req.body.senha;

			if(!nome || !email || !senha) {
				return res.status(400).json({ error: true, message: "Preencha todos os campos" });
			}
	
			let resultCriar = await usuarios.criarUsuario({
				nome: nome,
				email: email,
				senha: senha,
			});
	
			if(!resultCriar.sucesso) {
				return res.status(500).json({ error: true, message: resultCriar.erro });
			}

			const usuario = resultCriar.usuario;

			return res.status(201).json({
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email,
				biografia: usuario.biografia,
				fotoPerfil: usuario.fotoPerfil
			});
		} catch (err) {
			if (err.name === "ValidationError") {
				let errors = {};
	
				Object.keys(err.errors).forEach((key) => {
					errors[key] = err.errors[key].message;
				});
	
				return res.status(400).json({error: true, validation: errors});
			}
	
			res.status(500).send("Erro interno inesperado.");
		}
	}
}