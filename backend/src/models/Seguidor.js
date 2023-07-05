import mongoose from "mongoose";

// 'usuario' segue 'seguido'
const Seguidor = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "usuarios" 
    },
    seguido: { 
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        ref: "usuarios" 
    }
});

Seguidor.index({usuario: 1, seguido: 1}, { unique: true });

export default mongoose.model("seguidores", Seguidor);