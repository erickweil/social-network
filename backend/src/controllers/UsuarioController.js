import usuarios from "../models/Usuario.js";
import mongoose from "mongoose";
import anyAscii from "any-ascii";

export default class UsuarioControler {
	static async listarUsuarios(req,res) {
		const pagina = parseInt(req.query.pagina) || 1;
		const limite = 16;

		const filtrarNome = req.query.nome || false;

		let filtros = {};
		if(filtrarNome !== false) {
			// https://github.com/anyascii/anyascii
			// A ideia é permitir usar index e ainda assim pesquisar de forma case insensitive
			// e ignorando caracteres especiais
			filtros["nomeASCII"] = {
				$regex: new RegExp("^"+anyAscii(filtrarNome).toLowerCase())
			};
		}

		let listagem = usuarios.find(filtros);

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

			//Validação da senha
			//A ideia é que pode fazer senhas sem caracteres especiais só se for uma senha grande
			let minimo = 8;
			if(/^[0-9]*$/.test(senha)) {
				minimo = 22;
			} else if(/^[A-Z]*$/.test(senha) || /^[a-z]*$/.test(senha) ) {
				minimo = 18;
			} else if(/^[a-zA-Z]*$/.test(senha) || /^[A-Z0-9]*$/.test(senha) || /^[a-z0-9]*$/.test(senha)) {
				minimo = 14;
			} else if(/^[a-zA-Z0-9]*$/.test(senha)) {
				minimo = 12;
			} else {
				minimo = 8;
			}
						
			if(senha.length < minimo) {
				return res.status(400).json({ error: true, validation: { senha: "A senha com este padrão deve conter no mínimo "+minimo+" caracteres"}});
			}
	
			let resultCriar = await usuarios.criarUsuario({
				nome: nome,
				email: email,
				senha: senha,
			});
	
			if(!resultCriar.sucesso) {
				return res.status(500).json({ error: true, message: resultCriar.erro });
			}

			return res.status(201).json(usuarios.publicFields(resultCriar.usuario));
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