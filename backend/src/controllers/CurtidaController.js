import Curtida from "../models/Curtida.js";
import mongoose from "mongoose";
import Postagem from "../models/Postagem.js";

export default class CurtidaControler {

    static async listarPostagensCurtidas(req, res) {
		const idUsuario = req.usuario._id;

        const pagina = parseInt(req.query.pagina) || 1;
		const limite = 16;

		let listagem = Curtida.find({usuario: idUsuario}).sort({_id: -1 });
		
		if(pagina > 1) {
			listagem = listagem.skip(limite * (pagina - 1));
		}

		const resultado = await listagem
			.limit(limite)
			.populate({
				path: "postagem",
				populate: { path: "usuario"}
			})
            .lean(); // .lean() para poder editar ali o .curtida = true

		// Não é um problema porque o limite de documentos por request é um valor baixo
		let resposta = [];
		for(let linha of resultado) {
            let postagem = linha["postagem"];
            postagem.curtida = true;
			resposta.push(postagem);
		}

		return res.status(200).json({
			resposta: resposta,
			pagina: pagina,
			limite: limite
		});
    }

    static async curtirPostagem(req,res) {
        const idUsuario = req.usuario._id;
        const idPostagem = req.params.id;

		if(mongoose.Types.ObjectId.isValid(idPostagem) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        const postagem = await Postagem.findById(idPostagem);
        if(!postagem) return res.status(404).json({ error: true, message: "Postagem não encontrada" });

        const doc = { usuario: idUsuario, postagem: idPostagem };
        const resultado = await Curtida.replaceOne(doc,doc,{ upsert: true }); // substitui se existir.

        if(resultado.matchedCount == 1)
		return res.status(200).json({
            message: "Já estava curtido",
            numCurtidas: postagem.numCurtidas,
            estaCurtida: true
        });
        else {
            // Já que é uma nova curtida, incrementa o número de curtidas da postagem
            postagem.numCurtidas += 1;
            await postagem.save();

            return res.status(200).json({
                message: "Curtiu",
                numCurtidas: postagem.numCurtidas,
                estaCurtida: true
            });
        }
    }

    static async descurtirPostagem(req,res) {
        const idUsuario = req.usuario._id;
        const idPostagem = req.params.id;

		if(mongoose.Types.ObjectId.isValid(idPostagem) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        const postagem = await Postagem.findById(idPostagem);
        if(!postagem) return res.status(404).json({ error: true, message: "Postagem não encontrada" });

        const deletado = await Curtida.deleteOne({ usuario: idUsuario, postagem: idPostagem });

        if(deletado.deletedCount != 1)
        return res.status(200).json({
            message: "Já não estava curtido",
            numCurtidas: postagem.numCurtidas,
            estaCurtida: false
        });
        else {
            // Já que descurtiu, decrementa o número de curtidas da postagem
            postagem.numCurtidas -= 1;
            await postagem.save();
            
            return res.status(200).json({
                message: "Descurtiu",
                numCurtidas: postagem.numCurtidas,
                estaCurtida: false
            });
        }
    }
}