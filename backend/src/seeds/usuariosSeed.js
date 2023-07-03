import faker from "faker-br";
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
            nome: faker.name.findName(),
            email: faker.internet.email(),
            senha: "ABCDabcd1234",
        });

        if(resultado.sucesso !== true) {
            throw new Error(JSON.stringify(resultado));
        }

        const idUsuario = resultado.usuario.id;
        resultado = await Usuario.atualizarUsuario(idUsuario,{
            fotoPerfil: faker.internet.avatar(),
            biografia: faker.name.jobTitle(),
            preferencias: {
                notificacao: faker.random.boolean(),
                exibirEmail: faker.random.boolean(),
                contaPrivada: faker.random.boolean()
            }
        });

        if(resultado.sucesso !== true) {
            throw new Error(JSON.stringify(resultado));
        }

        process.stdout.write("\rCadastrando Usuários: "+(i+1)+"/"+quantidade+"\t");
    }

    console.log("OK!");
}