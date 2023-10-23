import fakerbr from "faker-br";
import { faker } from "@faker-js/faker";
import Usuario, { usuarioTeste } from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export default async function usuariosSeed(quantidade) {
    await Usuario.deleteMany();

    let resultado = await Usuario.criarUsuario(usuarioTeste );
    if(resultado.sucesso !== true) {
        throw new Error(JSON.stringify(resultado));
    }
    usuarioTeste.id = resultado.usuario.id;

    const senha = "ABCDabcd1234";
    const salt = await bcrypt.genSalt(); // defaault is 10 that takes under a second, 30 takes days
	const hashedPassword = await bcrypt.hash(senha,salt);

    let idUsuarios = [];
    for(let i = 0; i < quantidade; i++) {
        resultado = await Usuario.criarUsuario({
            nome: fakerbr.name.findName(),
            email: fakerbr.internet.email(),
            senha: senha,
            hashedPassword: hashedPassword // para não demorar uma eternidade
        });

        if(resultado.sucesso !== true) {
            throw new Error(JSON.stringify(resultado));
        }

        const idUsuario = resultado.usuario.id;
        idUsuarios.push(idUsuario);
        
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

        process.stdout.write("\rCadastrando Usuários: "+(i+1)+"/"+quantidade+"......\t");
    }
    console.log("OK!");

    return idUsuarios;
}