import mongoose from "mongoose";

// Usuário da rede social.
// Nome, email, senha
const Usuario = new mongoose.Schema({
	nome: {	
		type: String, 
		maxLength: [50, "O máximo de caracteres é 50"],
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
		minLength: [8, "O mínimo de caracteres é 8"],
		maxLength: [100, "A senha não pode passar de 100 caracteres"],
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
}, {
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

export default mongoose.model("usuario", Usuario);