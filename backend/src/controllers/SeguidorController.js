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

        let listagem = Seguidor.find({[quemProcurar]:id});
        
		if(pagina > 1) {
			listagem.skip(limite * (pagina - 1));
		}

		const resultado = await listagem.limit(limite).populate(quemEncontrar);

		// Remapeia o resultado da pesquisa para conter apenas os campos permitidos
		// Não é um problema porque o limite de documentos por request é um valor baixo
		let resposta = [];
		for(let seguidor of resultado) {
			resposta.push(Usuario.publicFields(seguidor[quemEncontrar]));
		}

		return res.status(200).json({
			resposta: resposta,
			pagina: pagina,
			limite: limite
		});
    }

	static async seguirUsuario(req,res) {
        const idUsuario = req.usuario.id;
        const idUsuarioSeguido = req.params.id;

		if(mongoose.Types.ObjectId.isValid(idUsuarioSeguido) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

		if(idUsuario == idUsuarioSeguido)
        return res.status(400).json({ error: true, message: "Não pode seguir você mesmo" });

        const usuarioExiste = await Usuario.findById(idUsuarioSeguido);
        if(!usuarioExiste) return res.status(404).json({ error: true, message: "Usuário não encontrado" });

        const jaEstaSeguindo = await Seguidor.findOne({ usuario: idUsuario, seguido: idUsuarioSeguido });

        if (jaEstaSeguindo)
        return res.status(200).json({ message: "Já estava seguindo" });

        const registro = await Seguidor.create({
            usuario: idUsuario,
            seguido: idUsuarioSeguido
        });

        // Atualizar contagem de 'seguidores' e 'seguindo' dos usuários
        await Usuario.updateOne({_id: idUsuario},        { $inc: { seguindo: 1 } });
        await Usuario.updateOne({_id: idUsuarioSeguido}, { $inc: { seguidores: 1 } });

		return res.status(200).json({message: "Seguindo"});
    }

    static async deixarSeguirUsuario(req,res) {
        const idUsuario = req.usuario.id;
        const idUsuarioSeguido = req.params.id;

		if(mongoose.Types.ObjectId.isValid(idUsuarioSeguido) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });

        if(idUsuario == idUsuarioSeguido)
        return res.status(400).json({ error: true, message: "Não pode deixar de seguir você mesmo" });

        const deletado = await Seguidor.deleteOne({ usuario: idUsuario, seguido: idUsuarioSeguido });

        if(deletado.deletedCount != 1)
        return res.status(200).json({ error: true, message: "Já tinha deixado de seguir" });

        // Atualizar contagem de 'seguidores' e 'seguindo' dos usuários (-1 para decrementar)
        await Usuario.updateOne({_id: idUsuario},        { $inc: { seguindo: -1 } });
        await Usuario.updateOne({_id: idUsuarioSeguido}, { $inc: { seguidores: -1 } });

		return res.status(200).json({message: "Deixou de seguir"});
    }
}