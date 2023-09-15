import mongoose from "mongoose";

// Definindo o schema do modelo de Curtidas
// A ideia é que apenas pesquise na coleção curtidas caso queira verificar se já curtiu algo.
// com o índice composto (usuario, postagem) será rápido tanto 
// pesquisar por todas as postagens curtidas de um usuário
// como se uma postagems específica foi curtida por um usuário específico
const Curtida = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  postagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "postagens",
    required: true
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: false }
});

Curtida.index({createdAt: 1}); // Para ficar rápido o sort

// Um usuário só pode curtir uma postagem uma vez
Curtida.index({usuario: 1, postagem: 1}, { unique: true });

Curtida.statics.populateCurtidas = async function(usuario,resultadoPostagens) {
  if(!usuario) return;

  const idPostagens = await resultadoPostagens.map((doc) => doc._id);
  const resultadoCurtidas = await this.find({
    $and: [
    { usuario: usuario._id }, // Encontrar todas as curtidas deste usuário
    { postagem: { $in: idPostagens } } // E que sejam destas postagens
    ]
  }).lean(); // .lean() para o find() funcionar

  for(let postagem of resultadoPostagens) {
    if(resultadoCurtidas.find((curtida) => curtida.postagem.equals(postagem._id))) {
      postagem.curtida = true;
      //console.log("TRUE: ",postagem);
    } else {
      postagem.curtida = false;
    }
  }
};

// Criando o modelo de Curtidas
export default mongoose.model("curtidas", Curtida);