import usuarios from "../models/Usuario.js";
import mongoose from "mongoose";

export default class UsuarioControler {
	static async listarUsuarios(req,res) {
		const pagina = parseInt(req.query.pagina) || 1;
		const limite = 16;

		let filtrarNome = req.query.nome || false;
		
		let listagem = false;
		if(filtrarNome !== false) {
			//filtrarNome = decodeURIComponent(filtrarNome);
			//console.log(filtrarNome);
			// https://github.com/anyascii/anyascii
			// A ideia é permitir usar index e ainda assim pesquisar de forma case insensitive
			// e ignorando caracteres especiais
			//filtros["nome"] = {
				//$regex: new RegExp(filtrarNome, "i")
			//};

			listagem = usuarios.find({
				$text: {
					$search: filtrarNome,
					$caseSensitive: false,
					$diacriticSensitive: false,
					$language: "pt"
				}
			});
		}
		else {
			listagem = usuarios.find({});
		}

		if(pagina > 1) {
			listagem.skip(limite * (pagina - 1));
		}

		const resultado = await listagem.limit(limite);

		// Remapeia o resultado da pesquisa para conter apenas os campos permitidos
		// Não é um problema porque o limite de documentos por request é um valor baixo
		let resposta = [];
		for(let usuario of resultado) {
			resposta.push(usuarios.publicFields(usuario));
		}

		return res.status(200).json({
			resposta: resposta,
			pagina: pagina,
			limite: limite
		});
	}
	
	static async listarUsuarioPorId(req,res) {
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });
	
		const usuario = await usuarios.findById(id);
		if(!usuario)
			return res.status(404).json({ error: true, message: "Usuário não encontrado" });
	
		return res.status(200).json(usuarios.publicFields(usuario));
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
				return res.status(400).json({ error: true, validation: resultCriar.validation });
			}

			return res.status(201).json(usuarios.publicFields(resultCriar.usuario));
		} catch (err) {
			console.log(err.stack || err);
			res.status(500).send("Erro interno inesperado.");
		}
	}

	static async atualizarUsuario(req,res) {
		try {
			const atualizar = req.body;

			let resultAtualizar = await usuarios.atualizarUsuario(
				req.usuario.id,
				atualizar
			);
	
			if(!resultAtualizar.sucesso) {
				return res.status(400).json({ error: true, validation: resultAtualizar.validation });
			}

			return res.status(200).json(usuarios.publicFields(resultAtualizar.usuario));
		} catch (err) {	
			console.log(err.stack || err);
			res.status(500).send("Erro interno inesperado.");
		}
	}

	static async deletarUsuario(req,res) {
		try {
			const email = req.usuario.email;
			const senha = req.body.senha;
	
			if(!email || !senha) {
				return res.status(498).json({ error: true, message: "É necessário confirmar a senha" });
			}
	
			const usuario = await usuarios.fazerLogin(email,senha);

			if(usuario === false) {
				return res.status(498).json({ error: true, message: "Não irá deletar a conta, senha incorreta" });
			}

			await usuarios.deleteOne({_id: usuario._id});

			return res.status(200).json({message: "Deletado com sucesso"});
		} catch (err) {	
			console.log(err.stack || err);
			res.status(500).send("Erro interno inesperado.");
		}
	}
}