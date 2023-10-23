import Seguidor from "../models/Seguidor.js";

export default async function seguidorSeed(idUsuarios,quantosPorUsuario) {
    await Seguidor.deleteMany();

    // seguir 10 outros usuários em média
    for(let i = 0; i < idUsuarios.length*quantosPorUsuario; i++) {
        let idUsuarioA = idUsuarios[Math.floor(Math.random() * idUsuarios.length)];
        let idUsuarioB = idUsuarios[Math.floor(Math.random() * idUsuarios.length)];

        if(idUsuarioA != idUsuarioB) {
            const doc = { usuario: idUsuarioA, seguido: idUsuarioB };
            await Seguidor.replaceOne(doc,doc,{ upsert: true }); // substitui se existir.
        }

        process.stdout.write("\rSeguindo Usuários: "+(i+1)+"/"+(idUsuarios.length*quantosPorUsuario)+"......\t");
    }
}