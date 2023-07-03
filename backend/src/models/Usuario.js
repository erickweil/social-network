import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
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
		validate: {
			validator: validator.isEmail,
			message: "Email inválido",
		},
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

// Se mudar isso tem que deletar o anterior e criar um novo
Usuario.index({nome: "text"}, {default_language: "pt"});

// Remapeia para conter apenas campos que podem ser vistos publicamente
// deste usuário
Usuario.statics.publicFields = function(usuario) {
	return {
		id: usuario.id,
		nome: usuario.nome,
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
	try {
		//Validação da senha
		//A ideia é que pode fazer senhas sem caracteres especiais só se for uma senha grande
		const senha = usuario_info.senha;

		const passwdOptions = {
			returnScore: true, 
			pointsPerUnique: 2, 
			pointsPerRepeat: 1, 
			pointsForContainingLower: 10, 
			pointsForContainingUpper: 10, 
			pointsForContainingNumber: 10, 
			pointsForContainingSymbol: 15 
		};
		// abcdABCD1234 -> 24 + 10 + 10 + 10 = 54
		
		if(senha.length < 8)
		return {sucesso: false, validation: {senha: "O mínimo são 8 caracteres"}};

		const forcaSenha = validator.isStrongPassword(senha,passwdOptions);
		const minimoForca = 40 + 10;
		if(forcaSenha < minimoForca) // mínimo de 8 caracteres únicos contendo minusculas, maiusculas, numeros e simbolos
		return {sucesso: false, validation: {senha: "A senha não atingiu o mínimo de força "+forcaSenha+"/"+minimoForca}};
		

		const usuario = await this.findOne({email:usuario_info.email});

		if(usuario)
		{
			return {sucesso:false,validation: {email: "Email já está em uso"}};
		}
		// No need to save salt
		const salt = await bcrypt.genSalt(); // defaault is 10 that takes under a second, 30 takes days
		const hashedPassword = await bcrypt.hash(senha,salt);
		
		// The two lines above could be: const hashedPassword = await bcrypt.hash(password,10)

		// go and save hashedPassword on db
		const novoUsuario = await this.create({
			nome: usuario_info.nome,
			email: usuario_info.email,
			senha: hashedPassword
		});

		return {sucesso:true,usuario:novoUsuario};
	} catch (err) {
		if (err.name === "ValidationError") {
			let errors = {};

			Object.keys(err.errors).forEach((key) => {
				errors[key] = err.errors[key].message;
			});

			return {sucesso: false, validation: errors};
		} else throw err;
	}
};

Usuario.statics.atualizarUsuario = async function(usuario_id,atualizar) {
	try {
		
		const usuario = await this.findById(usuario_id);

		if(atualizar.nome !== undefined) {
			usuario.nome = atualizar.nome;
		}

		if(atualizar.fotoPerfil !== undefined) usuario.fotoPerfil = atualizar.fotoPerfil;
		if(atualizar.biografia !== undefined) usuario.biografia = atualizar.biografia;
		if(atualizar.preferencias) {
			if(atualizar.preferencias.notificacao !== undefined) usuario.preferencias.notificacao = atualizar.preferencias.notificacao;
			if(atualizar.preferencias.exibirEmail !== undefined) usuario.preferencias.exibirEmail = atualizar.preferencias.exibirEmail;
			if(atualizar.preferencias.contaPrivada !== undefined) usuario.preferencias.contaPrivada = atualizar.preferencias.contaPrivada;
		}

		await usuario.save();

		return {sucesso:true,usuario:usuario};
	} catch (err) {
		if (err.name === "ValidationError") {
			let errors = {};

			Object.keys(err.errors).forEach((key) => {
				errors[key] = err.errors[key].message;
			});

			return {sucesso: false, validation: errors};
		} else throw err;
	}
};

export const usuarioTeste = {
    nome: "João da Silva",
    email: "joao@email.com",
    senha: "ABCDabcd1234"
};

export default mongoose.model("usuarios", Usuario);