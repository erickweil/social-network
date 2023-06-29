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
			let usuarioExiste = await usuarios.findOne({
				email: req.body.email
			});
	
			if (usuarioExiste) {
				return res.status(400).json({ error: true, message: "E-mail já cadastrado!" });
			}
	
			let usuario = await usuarios.create({
				nome: req.body.nome,
				email: req.body.email,
				senha: req.body.senha,
			});
	
			if(!usuario) {
				return res.status(500).json({ error: true, message: "Erro nos dados, confira e repita" });
			}
	
			let result = await usuario.save();
	
			return res.status(201).json({ _id: result.id });
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