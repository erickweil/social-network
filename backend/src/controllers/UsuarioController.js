import Seguidor from "../models/Seguidor.js";
import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";
import { deletarFotoUsuario, salvarFotoUsuario } from "../utils/foto.js";

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

			listagem = Usuario.find({
				$text: {
					$search: filtrarNome,
					$caseSensitive: false,
					$diacriticSensitive: false,
					$language: "pt"
				}
			});
		}
		else {
			listagem = Usuario.find({});
		}

		if(pagina > 1) {
			listagem.skip(limite * (pagina - 1));
		}

		const resultado = await listagem.limit(limite);

		// Remapeia o resultado da pesquisa para conter apenas os campos permitidos
		// Não é um problema porque o limite de documentos por request é um valor baixo
		let resposta = [];
		for(let usuario of resultado) {
			resposta.push(Usuario.publicFields(usuario));
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
	
		const usuario = await Usuario.findById(id);
		if(!usuario)
			return res.status(404).json({ error: true, message: "Usuário não encontrado" });
	
		return res.status(200).json(Usuario.publicFields(usuario));
	}
	
	static async cadastrarUsuario(req,res) {
		const nome = req.body.nome;
		const email = req.body.email;
		const senha = req.body.senha;

		if(!nome || !email || !senha) {
			return res.status(400).json({ error: true, message: "Preencha todos os campos" });
		}

		let resultCriar = await Usuario.criarUsuario({
			nome: nome,
			email: email,
			senha: senha,
		});

		if(!resultCriar.sucesso) {
			return res.status(400).json({ error: true, validation: resultCriar.validation });
		}

		return res.status(201).json(Usuario.publicFields(resultCriar.usuario));
	}


	static async _atualizarUsuario(idUsuario,atualizar,res) {
		let resultAtualizar = await Usuario.atualizarUsuario(
			idUsuario,
			atualizar
		);

		if(!resultAtualizar.sucesso) {
			return res.status(400).json({ error: true, validation: resultAtualizar.validation });
		}

		// Deletar as fotos antigas caso tenham sido atualizadas
		if(atualizar.fotoPerfil !== undefined) {
			await deletarFotoUsuario(idUsuario,resultAtualizar.usuarioAntes.fotoPerfil);
		}

		if(atualizar.fotoCapa !== undefined) {			
			await deletarFotoUsuario(idUsuario,resultAtualizar.usuarioAntes.fotoCapa);
		}

		return res.status(200).json(Usuario.publicFields(resultAtualizar.usuario));
	}

	static async atualizarUsuario(req,res) {
		const atualizar = req.body;

		if(atualizar.fotoPerfil !== undefined || atualizar.fotoCapa !== undefined) {
			return res.status(400).json({ error: true, message: "Não é possível atualizar a foto assim, utilize a rota dedicada" });
		}

		return await UsuarioControler._atualizarUsuario(req.usuario.id,atualizar,res);
	}

	static async atualizarFotoPerfil(req,res) {
		if(!req.file) {
			return res.status(400).json({ error: true, message: "Não enviou nenhuma imagem" });
		}
		
		const filepath = await salvarFotoUsuario(req.file,req.usuario);

		return await UsuarioControler._atualizarUsuario(req.usuario.id,{
			fotoPerfil: filepath
		},res);
	}

	static async atualizarFotoCapa(req,res) {		
		if(!req.file) {
			return res.status(400).json({ error: true, message: "Não enviou nenhuma imagem" });
		}

		const filepath = await salvarFotoUsuario(req.file,req.usuario);

		return await UsuarioControler._atualizarUsuario(req.usuario.id,{
			fotoCapa: filepath
		},res);
	}

	static async deletarUsuario(req,res) {
		const email = req.usuario.email;
		const senha = req.body.senha;

		if(!email || !senha) {
			return res.status(498).json({ error: true, message: "É necessário confirmar a senha" });
		}

		const usuario = await Usuario.fazerLogin(email,senha);

		if(usuario === false) {
			return res.status(498).json({ error: true, message: "Não irá deletar a conta, senha incorreta" });
		}

		// Deletar todos os seguidores e seguindo deste usuário
		
		// 1. Deletar todas as entradas de seguidores
		const resultadoDeletarSeguidor = await Seguidor.deleteMany({ 
			$or: [{
			usuario: usuario._id
			}, {
			seguido: usuario._id
			}]
		});

		// 2. Deletar fotos do usuário
		await deletarFotoUsuario(usuario.id,usuario.fotoPerfil);
		await deletarFotoUsuario(usuario.id,usuario.fotoCapa);

		// 3. Deletar o usuário
		const resultadoDeletarUsuario = await Usuario.deleteOne({_id: usuario._id});

		if(resultadoDeletarUsuario.deletedCount == 1)
		return res.status(200).json({message: "Deletado com sucesso"});
		else
		return res.status(500).json({error: true, message: "Erro ao deletar usuário: "+JSON.stringify(resultadoDeletarUsuario)});
	}
}