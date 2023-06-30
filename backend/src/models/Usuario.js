import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import anyAscii from "any-ascii";
// Usuário da rede social.
// Nome, email, senha
const Usuario = new mongoose.Schema({
	nome: {	
		type: String, 
		maxLength: [50, "O máximo de caracteres é 50"],
		required: [true, "Nome é obrigatório"]
	},	
	// Para realizar pesquisa, pré-processado para ser minúsculo e sem acentos
	// Não pode mudar o nome sem atualizar também este campo
	nomeASCII: {
		type: String,
		index: true,
		required: [true, "Nome é obrigatório"]
	},
	email: { 
		type: String, 
		maxLength: [320, "O máximo de caracteres é 320"],
		index: true,
		unique: true,
		required: [true, "Email é obrigatório"]
	},
	senha: { 
		type: String,
		select: false,
		required: [true, "Senha é obrigatória"]
	},
	fotoPerfil: {
		type: String,
		default: "/img/usuario-default.png"
	},
	biografia: {
		type: String,
		maxLength: [160, "sua biografia não pode passar de 160 caracteres"],
		default: ""
	},
	preferencias: {
		notificacao: { type: Boolean, default: true },
		exibirEmail: { type: Boolean, default: true },
		contaPrivada: { type: Boolean, default: false }
	}
}, {
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// Remapeia para conter apenas campos que podem ser vistos publicamente
// deste usuário
Usuario.statics.publicFields = function(usuario) {
	return {
		id: usuario.id,
		nome: usuario.nome,
		nomeASCII: usuario.nomeASCII,
		email: usuario.preferencias.exibirEmail ? usuario.email : undefined,
		fotoPerfil: usuario.fotoPerfil,
		biografia: usuario.biografia
	};
};

Usuario.statics.fazerLogin = async function(email,senha) {
    const usuario = await this.findOne({email:email}).select("+senha");

    if(!usuario) return false;

    const hashMatched = await bcrypt.compare(senha, usuario.senha);
    if(!hashMatched) return false;

    return usuario;
};

Usuario.statics.criarUsuario = async function(usuario_info) {
	const usuario = await this.findOne({email:usuario_info.email});

	if(usuario)
	{
		return {sucesso:false,erro:"Usuário já existe"};
	}
	// No need to save salt
	const salt = await bcrypt.genSalt(); // defaault is 10 that takes under a second, 30 takes days
	const hashedPassword = await bcrypt.hash(usuario_info.senha,salt);
	
	// The two lines above could be: const hashedPassword = await bcrypt.hash(password,10)

	// go and save hashedPassword on db
	const novoUsuario = await this.create({
		nome: usuario_info.nome,
		nomeASCII: anyAscii(usuario_info.nome).toLowerCase(),
		email: usuario_info.email,
		senha: hashedPassword
	});

	return {sucesso:true,usuario:novoUsuario};
};

export default mongoose.model("usuario", Usuario);