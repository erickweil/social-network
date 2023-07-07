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
		default: ""
	},
	fotoCapa: {
		type: String,
		default: ""
	},
	biografia: {
		type: String,
		maxLength: [160, "sua biografia não pode passar de 160 caracteres"],
		default: ""
	},
	preferencias: {
		notificacao: { type: Boolean, select: false, default: true },
		exibirEmail: { type: Boolean, select: false, default: true }, // não funciona de fato
		contaPrivada: { type: Boolean, select: false, default: false }
	}
}, {
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// Se mudar isso tem que deletar o anterior e criar um novo
Usuario.index({nome: "text"}, {default_language: "pt"});

Usuario.statics.fazerLogin = async function(email,senha) {
    const usuario = await this.findOne({email:email}).select("+senha");

    if(!usuario) return false;

    const hashMatched = await bcrypt.compare(senha, usuario.senha);
    if(!hashMatched) return false;

	usuario.senha = undefined;
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

		let hashedPassword = false;
		// para teste apenas
		if(usuario_info.hashedPassword) {
			hashedPassword = usuario_info.hashedPassword;
		} else {
			// No need to save salt
			const salt = await bcrypt.genSalt(); // defaault is 10 that takes under a second, 30 takes days
			hashedPassword = await bcrypt.hash(senha,salt);
		}
		
		// The two lines above could be: const hashedPassword = await bcrypt.hash(password,10)

		// go and save hashedPassword on db
		const novoUsuario = await this.create({
			nome: usuario_info.nome,
			email: usuario_info.email,
			senha: hashedPassword
		});

		novoUsuario.senha = undefined; // remove do resultado
		novoUsuario.preferencias = undefined; // remove do resultado
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
		
		const usuario = await this.findById(usuario_id).select("+preferencias.notificacao +preferencias.exibirEmail +preferencias.contaPrivada");
		const fotoPerfil = usuario.fotoPerfil;
		const fotoCapa = usuario.fotoCapa;

		if(atualizar.nome !== undefined) {
			usuario.nome = atualizar.nome;
		}

		if(atualizar.fotoPerfil !== undefined) usuario.fotoPerfil = atualizar.fotoPerfil;
		if(atualizar.fotoCapa !== undefined) usuario.fotoCapa = atualizar.fotoCapa;
		if(atualizar.biografia !== undefined) usuario.biografia = atualizar.biografia;
		if(atualizar.preferencias) {
			if(atualizar.preferencias.notificacao !== undefined) usuario.preferencias.notificacao = atualizar.preferencias.notificacao;
			if(atualizar.preferencias.exibirEmail !== undefined) usuario.preferencias.exibirEmail = atualizar.preferencias.exibirEmail;
			if(atualizar.preferencias.contaPrivada !== undefined) usuario.preferencias.contaPrivada = atualizar.preferencias.contaPrivada;
		}

		await usuario.save();

		usuario.preferencias = undefined; // remove do resultado
		return {sucesso:true, usuario:usuario, fotoPerfil:fotoPerfil, fotoCapa:fotoCapa};
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