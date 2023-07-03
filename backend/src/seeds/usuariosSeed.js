import fakerbr from "faker-br";
import { faker } from "@faker-js/faker";
import Usuario, { usuarioTeste } from "../models/Usuario.js";
import Seguidor from "../models/Seguidor.js";

export default async function usuariosSeed(quantidade) {
    await Seguidor.deleteMany();
    await Usuario.deleteMany();

    let resultado = await Usuario.criarUsuario(usuarioTeste );
    if(resultado.sucesso !== true) {
        throw new Error(JSON.stringify(resultado));
    }
    usuarioTeste.id = resultado.usuario.id;

    for(let i = 0; i < quantidade; i++) {
        resultado = await Usuario.criarUsuario({
            nome: fakerbr.name.findName(),
            email: fakerbr.internet.email(),
            senha: "ABCDabcd1234",
        });

        if(resultado.sucesso !== true) {
            throw new Error(JSON.stringify(resultado));
        }

        const idUsuario = resultado.usuario.id;
        resultado = await Usuario.atualizarUsuario(idUsuario,{
            fotoPerfil: faker.internet.avatar(),
            fotoCapa: faker.image.urlLoremFlickr(),
            biografia: fakerbr.name.jobTitle(),
            preferencias: {
                notificacao: fakerbr.random.boolean(),
                exibirEmail: fakerbr.random.boolean(),
                contaPrivada: fakerbr.random.boolean()
            }
        });

        if(resultado.sucesso !== true) {
            throw new Error(JSON.stringify(resultado));
        }

        process.stdout.write("\rCadastrando Usuários: "+(i+1)+"/"+quantidade+"\t");
    }

    console.log("OK!");
}