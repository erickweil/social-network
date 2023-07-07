import Seguidor from "../models/Seguidor.js";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";

export default class SeguidorControler {

    static async listarSeguindo(req,res) {
        SeguidorControler.listarSeguidores(req,res,true);
    }

    static async listarSeguidores(req,res,listarSeguindo) {
        const id = req.params.id;
        const pagina = parseInt(req.query.pagina) || 1;
		const limite = 16;

		if(mongoose.Types.ObjectId.isValid(id) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        let quemProcurar = listarSeguindo === true ? "usuario" : "seguido";
        let quemEncontrar = listarSeguindo === true ? "seguido" : "usuario";

        let listagem = Seguidor.find({[quemProcurar]:id}).sort({createdAt: -1 });
        
		if(pagina > 1) {
			listagem = listagem.skip(limite * (pagina - 1));
		}

		const resultado = await listagem.limit(limite).populate(quemEncontrar);

		// Não é um problema porque o limite de documentos por request é um valor baixo
		let resposta = [];
		for(let seguidor of resultado) {
			resposta.push(seguidor[quemEncontrar]);
		}

		return res.status(200).json({
			resposta: resposta,
			pagina: pagina,
			limite: limite
		});
    }

    // Pode ser bastante lento caso o usuário possua quantia alta de seguidores/seguindo
    // Opção 1: Cache (Contagem pode ficar desatualizada)
    // Opção 3: Pré-calcular de tempo em tempo (Contagem pode ficar desatualizada)
    // Opção 2: Guardar contagem no model Usuario, atualizar quando necessário
    //          2.1: Atualizar por incrementar e decrementar em 1 a cada operação (lento deletar usuário, como evitar inconsistência quando houver erros?)
    //          2.2: Atualizar por contar tudo (Será MUITO lento deletar usuário com muito seguidores/seguindo)
    static async contarSeguidores(req,res) {
        const id = req.params.id;

		if(mongoose.Types.ObjectId.isValid(id) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        let countSeguidores = await Seguidor.countDocuments({seguido:id});
        let countSeguindo = await Seguidor.countDocuments({usuario:id});
        
        // Está certo isso, retorna OK para usuários inexistentes?
		return res.status(200).json({
			seguidores: countSeguidores,
			seguindo: countSeguindo
		});
    }

	static async seguirUsuario(req,res) {
        const idUsuario = req.usuario._id;
        const idUsuarioSeguido = req.params.id;

		if(mongoose.Types.ObjectId.isValid(idUsuarioSeguido) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        // toString porque precisa converter de ObjectId para string
		if(idUsuarioSeguido === idUsuario.toString())
        return res.status(400).json({ error: true, message: "Não pode seguir você mesmo" });

        const usuarioExiste = await Usuario.findById(idUsuarioSeguido);
        if(!usuarioExiste) return res.status(404).json({ error: true, message: "Usuário não encontrado" });

        const doc = { usuario: idUsuario, seguido: idUsuarioSeguido };
        const resultado = await Seguidor.replaceOne(doc,doc,{ upsert: true }); // substitui se existir.

        if(resultado.matchedCount == 1)
		return res.status(200).json({message: "Já estava Seguindo"});
        else
        return res.status(200).json({message: "Está seguindo"});
    }

    static async deixarSeguirUsuario(req,res) {
        const idUsuario = req.usuario._id;
        const idUsuarioSeguido = req.params.id;

		if(mongoose.Types.ObjectId.isValid(idUsuarioSeguido) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        const deletado = await Seguidor.deleteOne({ usuario: idUsuario, seguido: idUsuarioSeguido });

        if(deletado.deletedCount != 1)
        return res.status(200).json({message: "Já tinha deixado de seguir" });
        else
		return res.status(200).json({message: "Deixou de seguir"});
    }
}