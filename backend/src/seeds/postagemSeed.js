import fakerbr from "faker-br";
import { faker } from "@faker-js/faker";
import Usuario, { usuarioTeste } from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import Postagem from "../models/Postagem.js";

function getRandomPost(long) {
    if(long) return faker.lorem.paragraph({min: 3, max: 10});
    else return faker.lorem.sentence({min: 3, max: 20});
}

export default async function postagemSeed(idUsuarios,quantidade) {
    await Postagem.deleteMany();
    
    let chanceResposta = 0.90; // chance de um usuário responder uma postagem;
    let chanceImagem = 0.25;
    let chanceHashtag = 0.1;
    // fazer postagens para cada usuário
    let idPostagens = [];
    for(let i = 0; i < idUsuarios.length*quantidade; i++) {
        let idUsuario = idUsuarios[Math.floor((Math.random()*Math.random()) * idUsuarios.length)];
        let idPostagemPai = Math.random() < chanceResposta ? idPostagens[Math.floor(Math.random() * idPostagens.length)] : undefined;

        let conteudo = getRandomPost(Math.random() > 0.8);
        let imagens = [];
        if(Math.random() < chanceImagem) {
            imagens.push(faker.image.urlLoremFlickr());
        }

        if(Math.random() < chanceHashtag) {
            let quantos = Math.random() * 10 + 1;
            for(let k = 0; k < quantos; k++) {
                conteudo += " #"+faker.lorem.slug({min:1, max: 2});
            }
        }

        let resultCriar = await Postagem.criarPostagem({
            idUsuario: idUsuario,
            idPostagemPai: idPostagemPai,
            conteudo: conteudo,
            imagens: imagens,
        });

        idPostagens.push(resultCriar.postagem.id);

        process.stdout.write("\rPostando: "+(i+1)+"/"+(idUsuarios.length*quantidade)+"......\t");
    }
}