import mongoose from "mongoose";

// 'usuario' segue 'seguido'
const Seguidor = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "usuario" },
    seguido: { type: mongoose.Schema.Types.ObjectId, ref: "usuario" }
});

export default mongoose.model("seguidor", Seguidor);