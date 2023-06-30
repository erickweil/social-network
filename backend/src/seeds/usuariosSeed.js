import faker from "faker-br";
import Usuario from "../models/Usuario.js";

export default async function usuariosSeed(quantidade) {
    await Usuario.deleteMany();

    await Usuario.criarUsuario({
        nome: "João da Silva",
        email: "joao@email.com",
        senha: "ABCDabcd1234",
    });

    for(let i = 0; i < quantidade; i++) {
        let resultado = await Usuario.criarUsuario({
            nome: faker.name.findName(),
            email: faker.internet.email(),
            senha: faker.internet.password(),
        });

        if(resultado.sucesso !== true) {
            throw new Error(JSON.stringify(resultado));
        }

        resultado = await Usuario.atualizarUsuario(resultado.usuario.id,{
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