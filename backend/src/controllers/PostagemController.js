import mongoose from "mongoose";
import Postagem from "../models/Postagem.js";
import Curtida from "../models/Curtida.js";
import { deletarFotoUsuario, salvarFotoUsuario } from "../utils/foto.js";
import anyAscii from "any-ascii";

export default class PostagemController {

    static async _listarPostagens(req, res, filtrar, popular) {
        const pagina = parseInt(req.query.pagina) || 1;
		const limite = 16;
		const limiteRespostas = 5;

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
		} else {
			if(filtrar.exibirApenasPostagens)
			{
				filtros.push({
					postagemPai: {$exists: false}
				});
			}
			else if(filtrar.exibirApenasRespostas)
			{
				filtros.push({
					postagemPai: {$exists: true}
				});
			}
		}

        if(filtrar.hashtag) {
            filtros.push({
				hashtags: "#"+anyAscii(filtrar.hashtag).toLowerCase()
			});
        }
		if(filtrar.esconderDeletados) {
            filtros.push({
				deletado: { $ne: true }
			});
		}

		let listagem;
		if(filtros.length == 0)
		listagem = Postagem.find({});
		else if(filtros.length == 1)
		listagem = Postagem.find(filtros[0]);
		else
		listagem = Postagem.find({ $and: filtros});

		// Se está listando postagens em geral e não respostas à uma postagem, ordena por mais recentes primeiro
		if(!filtrar.resposta) {
			listagem = listagem.sort({createdAt: -1 });
		}
		
		if(pagina > 1) {
			listagem = listagem.skip(limite * (pagina - 1));
		}

		listagem = listagem.limit(limite);

		if(popular.usuario) listagem = listagem.populate("usuario");
		if(popular.postagemPai) listagem = listagem.populate("postagemPai");

		const resultado = await listagem.lean();

		await Curtida.populateCurtidas(req.usuario,resultado);

		// Lento? +2 querys: 1 para encontrar e 1 populate usuario.
		// Será que não existe um populate() ou algo do tipo que faz isso?
		if(popular.respostas) {
			// Fazer pesquisa das 5 primeiras respostas à cada postagem listada
			const idPostagens = resultado.map((doc) => doc._id);
			let respostaListagem = Postagem.find({
				$and: [
				{ postagemPai: { $in: idPostagens } }, // Encontrar todas postagens com esses pais
				{ posicao: { $lte: limiteRespostas } } // E que tenha como posição um valor menor que 5
				]
			})
			.limit(limite * limiteRespostas); // Para limitar, vai que né... 

			if(popular.usuario) respostaListagem = respostaListagem.populate("usuario"); // Consistência

			const resultadoRespostas = await respostaListagem.lean();

			await Curtida.populateCurtidas(req.usuario,resultadoRespostas);

			for(let postagem of resultado) { // Colocar as respostas nos lugares corretos.
				postagem.respostas = new Array(limiteRespostas); // Inicia o array com undefined nos espaços possíveis
				// Usando equals porque são dois ObjectId
				const resps = resultadoRespostas.filter((doc) => doc.postagemPai.equals(postagem._id));
				//console.log(resps);
				for(let postagemResp of resps) {
					postagem.respostas[postagemResp.posicao] = postagemResp;
				}
				postagem.respostas.length = resps.length; // truncar o array de volta
			}
		}

		return res.status(200).json({
			resposta: resultado,
			pagina: pagina,
			limite: limite
		});  
    }

    static async realizarPostagem(req, res) {
        const usuario = req.usuario;
		const idUsuario = usuario._id;
        let conteudo = "";
        let idPostagemPai = undefined;

        if(req.fields && req.fields.conteudo) conteudo = req.fields.conteudo[0];
        if(req.fields && req.fields.postagemPai) idPostagemPai = req.fields.postagemPai[0];

        let imagens = [];
        let imagens_path = [];
        if(req.files && req.files.length > 0) {
            imagens = req.files;

            for(let imagem of imagens) {
                const filepath = await salvarFotoUsuario(imagem,idUsuario,{});
                imagens_path.push(filepath);
            }
		}

        let resultCriar = await Postagem.criarPostagem({
            idUsuario: idUsuario,
            idPostagemPai: idPostagemPai,
            conteudo: conteudo,
            imagens: imagens_path,
        });

		if(!resultCriar.sucesso) {
			return res.status(400).json({ error: true, validation: resultCriar.validation });
		}

		resultCriar.postagem.usuario = usuario;
		return res.status(201).json(resultCriar.postagem);
    }

    static async listarPostagemPorId(req, res) {
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });
	
		const postagem = await Postagem.findById(id).populate("usuario").lean();
		if(!postagem)
			return res.status(404).json({ error: true, message: "Postagem não encontrada" });
	
		await Curtida.populateCurtidas(req.usuario,[postagem]);

		return res.status(200).json(postagem);
    }

    static async deletarPostagem(req, res) {
		// Deletar a postagem não realmente irá deletá-la, 
		// irá apenas remover o seu conteúdo
		const id = req.params.id;
		const idUsuario = req.usuario._id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });

		const postagem = await Postagem.findById(id);
		if(!postagem)
			return res.status(404).json({ error: true, message: "Postagem não encontrada" });

		// usando equals porque são dois ObjectId
		if(!idUsuario.equals(postagem.usuario)) {
			return res.status(401).json({ error: true, message: "Só é possível deletar as suas próprias postagens" });			
		}

		if(postagem.deletado) {
			return res.status(200).json({message: "Já estava Deletado"});
		}

		// Deletar arquivos das imagens da postagem;
		if(postagem.imagens)
		for(let img of postagem.imagens) {
			await deletarFotoUsuario(idUsuario,img);
		}

		postagem.conteudo = "";
		postagem.hashtags = [];
		postagem.imagens = [];
		postagem.deletado = true;
		await postagem.save();

		return res.status(200).json({message: "Deletado com sucesso"});
    }

    static async listarPostagens(req, res) {		
		PostagemController._listarPostagens(req,res,{
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined,
			esconderDeletados: true,
			exibirApenasPostagens: true
		}, {
			usuario: true
		});
    }
    
	// Deveria expandir uma parte das respostas das respostas?
    static async listarRespostas(req, res) {
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });

		PostagemController._listarPostagens(req,res,{
			resposta: id,
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined,
			esconderDeletados: false // <-- deve ser possível ver respostas à posts deletados 
		}, {
			usuario: true,
			respostas: true
		});
    }

    static async listarPostagensUsuario(req, res) {		
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });

		PostagemController._listarPostagens(req,res,{
			usuario: id,
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined,
			esconderDeletados: true,
			exibirApenasPostagens: true
		}, {
			usuario: true
		});
    }

    static async listarRespostasUsuario(req, res) {		
		const id = req.params.id;
	
		if(mongoose.Types.ObjectId.isValid(id) === false)
			return res.status(400).json({ error: true, message: "ID inválido" });

		PostagemController._listarPostagens(req,res,{
			usuario: id,
			pesquisa: req.query.pesquisa || undefined,
			hashtag: req.query.hashtag || undefined,
			esconderDeletados: true,
			exibirApenasRespostas: true
		}, {
			usuario: true
		});
    }
}