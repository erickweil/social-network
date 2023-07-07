import mongoose from "mongoose";
import Postagem from "../models/Postagem.js";
import { salvarFotoUsuario } from "../utils/foto.js";
import anyAscii from "any-ascii";

export default class PostagemController {

    static async _listarPostagens(req, res, filtrar) {
        const pagina = parseInt(req.query.pagina) || 1;
		const limite = 16;

        let filtros = [];
		if(filtrar.pesquisa) {
			filtros.push({
				$text: {
					$search: filtrar.pesquisa,
					$caseSensitive: false,
					$diacriticSensitive: false,
					$language: "pt"
				}
			});
		}
		if(filtrar.usuario) {
            filtros.push({
				usuario: filtrar.usuario
			});
		}
		if(filtrar.resposta) {
            filtros.push({
				postagemPai: filtrar.resposta
			});
		}
        if(filtrar.hashtag) {
            filtros.push({
				hashtags: "#"+anyAscii(filtrar.hashtag).toLowerCase()
			});
        }

		let listagem;
		if(filtros.length == 0)
		listagem = Postagem.find({});
		else if(filtros.length == 1)
		listagem = Postagem.find(filtros[0]);
		else
		listagem = Postagem.find({ $and: filtros});
		
		if(pagina > 1) {
			listagem.skip(limite * (pagina - 1));
		}

		const resultado = await listagem.limit(limite).populate("usuario");

		return res.status(200).json({
			resposta: resultado,
			pagina: pagina,
			limite: limite
		});  
    }

    static async listarPostagens(req, res) {		
		PostagemController._listarPostagens(req,res,{
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined
		});
    }

    static async realizarPostagem(req, res) {
        const usuario = req.usuario;
        let conteudo = "";
        let idPostagemPai = undefined;

        if(req.fields && req.fields.conteudo) conteudo = req.fields.conteudo[0];
        if(req.fields && req.fields.postagemPai) idPostagemPai = req.fields.postagemPai[0];

        let imagens = [];
        let imagens_path = [];
        if(req.files && req.files.length > 0) {
            imagens = req.files;

            for(let imagem of imagens) {
                const filepath = await salvarFotoUsuario(imagem,usuario,{});
                imagens_path.push(filepath);
            }
		}

        let resultCriar = await Postagem.criarPostagem({
            idUsuario: usuario.id,
            idPostagemPai: idPostagemPai,
            conteudo: conteudo,
            imagens: imagens_path,
        });

		if(!resultCriar.sucesso) {
			return res.status(400).json({ error: true, validation: resultCriar.validation });
		}

		return res.status(201).json(resultCriar.postagem);
    }

    static async listarPostagemPorId(req, res) {
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });
	
		const postagem = await Postagem.findById(id).populate("usuario");
		if(!postagem)
			return res.status(404).json({ error: true, message: "Postagem não encontrada" });
	
		return res.status(200).json(postagem);
    }

    static async deletarPostagem(req, res) {
        return res.status(500).json({error: true, message: "NADA AQUI"});
    }
    
	// Deveria listar uma parte das respostas das respostas?
    static async listarRespostas(req, res) {
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });

		PostagemController._listarPostagens(req,res,{
			resposta: id,
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined
		});
    }

    static async listarPostagensUsuario(req, res) {		
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });

		PostagemController._listarPostagens(req,res,{
			usuario: id,
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined
		});
    }
}