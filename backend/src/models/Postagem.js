import mongoose from "mongoose";
import anyAscii from "any-ascii";
// Uma postagem pode ser tanto uma postagem normal como 
// uma resposta à uma outra postagem. 'Tudo são postagens'

// Índice no 'usuario' porque irá pesquisar postagens de um usuário
// Índice de texto em 'conteudo' porque irá procurar postagens usando pesquisa de texto
// Índice em 'hashtags' porque irá listar postagens com uma hashtag específica
// Índice composto (postagemPai, nivel, posicao) para pesquisar tanto pela postagemPai como também especificando nivel
const Postagem = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usuarios",
        required: true,
        index: true
    },
    conteudo: {
        type: String,
        maxLength: [1000, "O máximo de caracteres é 1000"],
        default: ""
    },
    hashtags: [{
        type: String,
        index: true
    }],
    imagens: [{
        type: String
    }],
    numCurtidas: {
        type: Number,
        default: 0
    },
    numRespostas: { // número de respostas a esta postagem (quantas postagens filhas)
        type: Number,
        default: 0
    },
    nivel: { // quantos níveis de respostas de respostas... (Para filtrar mais fácil)
        type: Number,
        default: 0
    },

    // --------------------------------------------------------------------------
    // Atributos contidos apenas em Postagens que são respostas a outra postagem:
    // --------------------------------------------------------------------------
    postagemPai: { // caso seja uma resposta a outra Postagem (comentário)
        type: mongoose.Schema.Types.ObjectId,
        ref: "postagens",
        required: false
    },
    posicao: { // a posição do comentário na listagem ou sub-listagem (Para filtrar mais fácil)
               // Basicamente é a contagem de respostas na postagem pai no instante que foi criado
        type: Number,
        required: false
    },
}, {
	timestamps: { createdAt: "created_at", updatedAt: false }
});

Postagem.index({conteudo: "text"}, {default_language: "pt"}); // Ver depois se não é lento demais índice de texto em campo de texto tão grande
// Postagem.index({postagemPai: 1, nivel: 1});
Postagem.index({postagemPai: 1, nivel: 1, posicao: 1}); // Ver depois se isso é um problema índice composto de 3 campos

// https://stackoverflow.com/questions/25538860/extracting-hashtags-out-of-a-string
const extractHashtags = (txt) => {
    if(!txt) return [];

    const ascii = anyAscii(txt).toLowerCase();

    return ascii.match(/#\w+/g) || [];
};

Postagem.statics.criarPostagem = async function(postagem_info) {
	try {
        const idPostagemPai = postagem_info.idPostagemPai;
        const conteudo = postagem_info.conteudo; // A FAZER: sanitizar o texto, remover caracteres problemáticos
        
        // Extrair os hashtags, 
        // "Exemplo de texto #hash #TAG #ComAcentuação" -> ["#hash","#tag","#comacentuacao"]
        const hashtags = extractHashtags(conteudo);

        if(idPostagemPai === undefined) {
            // Se é uma postagem normal, que não é resposta à outra
            const novaPostagem = await this.create({
                usuario: postagem_info.idUsuario,
                conteudo: conteudo,
                hashtags: hashtags,
                imagens: postagem_info.imagens
            });

            return {sucesso:true,postagem:novaPostagem};
        } else {
            // Se é uma resposta a uma postagem, encontrar essa postagem que está sendo respondida
            if(mongoose.Types.ObjectId.isValid(idPostagemPai) === false)
            return {sucesso: false, validation: { postagem: "ID de postagem inválido" }};
            
            const postagemPai = await this.findById(idPostagemPai);
            
            if(!postagemPai)
            return {sucesso: false, validation: { postagem: "Postagem não encontrada" }};

            // Criar resposta à postagem, 
            // nivel indica o número de respostas pai até chegar à postagem original
            // posicao indica a posição desta resposta em relação às outras respostas no mesmo nivel
            const novaPostagem = await this.create({
                usuario: postagem_info.idUsuario,
                conteudo: conteudo,
                hashtags: hashtags,
                imagens: postagem_info.imagens,
                postagemPai: postagemPai.id,
                nivel: postagemPai.nivel + 1,
                posicao: postagemPai.numRespostas,
            });

            // Incrementa o contador de respostas da postagem que recebeu a resposta
            postagemPai.numRespostas += 1;
            await postagemPai.save();

            return {sucesso:true,postagem:novaPostagem};
        }
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

// Criando o modelo de Postagens
export default mongoose.model("postagens", Postagem);