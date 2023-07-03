import {jest,describe,expect,test} from "@jest/globals";

import faker from "faker-br";
import app from "../../src/app.js";
import request  from "supertest";

describe("Usuarios",() => {
	
    const rdn = faker.random.alphaNumeric(8); // Para ser único na pesquisa depois
    const novoUsuario = {
		nome: rdn+" Téstê жぁ書😎⍨.̶̡̨̳̝͓͚̲͇͖̥͓̄͂͆̀̏̑̒̃̄̽̿̍͘͝.",
		email: rdn+"@teste.com",
        senha:"ABCDabcd1234"
	};
    let token = false;
	const req = request(app);

    let usuarioQualquer = false;
    let usuariosQuaisquer = [];

    // função ajudadora
    const getUsuarioPorID = async (id) => {
        const res = await req
        .get("/usuarios/"+id)
        .set("Authorization", `Bearer ${token}`)  
        .set("Accept", "aplication/json")
        .expect(200);

        return res.body;
    };

    const getSeguidoresUsuario = async (id) => {
        const res = await req
        .get("/usuarios/"+id+"/contar-seguidores")
        .set("Authorization", `Bearer ${token}`)  
        .set("Accept", "aplication/json")
        .expect(200);

        return res.body;
    };

    test("Criar usuario senhas fracas:", async () => {
        const senhasFracas = [
            "123456789012345678901",
            "abcdefghijklmnopq",
            "QWERTYUqwerty",
            "ABCabc123",
            "1!bcdBC"
        ];

        for(let senha of senhasFracas) {
            const res = await req
                .post("/usuarios")
                .set("Authorization", `Bearer ${token}`)  
                .set("Accept", "aplication/json")
                .send({...novoUsuario,...{
                    senha:senha
                }})
                .expect(400);

            expect(res.body.validation).toBeDefined();
            expect(res.body.validation.senha).toBeDefined();
        }
	});

    test("Criar usuário Inválido", async () => {
        const nome = "01234567890123456789012345678901234567890123456789 - Mais de 50 caracteres";
        const res = await req
            .post("/usuarios")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .send({...novoUsuario,...{
                nome: nome
            }})
            .expect(400);

        expect(res.body.validation).toBeDefined();
        expect(res.body.validation.nome).toBeDefined();
    });

    test("Criar usuário", async () => {
		const res = await req
            .post("/usuarios")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .send(novoUsuario)
            .expect(201);

        expect(res.body.nome).toBe(novoUsuario.nome);
        expect(res.body.email).toBe(novoUsuario.email);
        expect(res.body.senha).toBeUndefined();

        novoUsuario.id = res.body.id;
    });

    test("Criar usuario duplicado:", async () => {		
		const res = await req
            .post("/usuarios")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .send(novoUsuario)
            .expect(400);

        expect(res.body.validation).toBeDefined();
        expect(res.body.validation.email).toBeDefined();
	});

    test("Não deve autenticar", async () => {
        const res = await req
            .post("/login")
            .set("Accept", "aplication/json")
            .send({
                email: novoUsuario.email,
                senha: "SENHAERRADA",
            })
            .expect(400);
    });

    test("Deve autenticar", async () => {
        const res = await req
            .post("/login")
            .set("Accept", "aplication/json")
            .send({
                email: novoUsuario.email,
                senha: novoUsuario.senha,
            })
            .expect(200);

        token = res.body.token;
        expect(token).toBeTruthy();
    });

    test("Usuário por ID", async () => {
		const usuario = await getUsuarioPorID(novoUsuario.id);

        expect(usuario.id).toBe(novoUsuario.id);
        expect(usuario.nome).toBe(novoUsuario.nome);
        expect(usuario.email).toBe(novoUsuario.email);
        expect(usuario.fotoPerfil).toBeDefined();
        expect(usuario.biografia).toBeDefined();
        expect(usuario.senha).toBeUndefined();
    });

    test("Usuário inexistente Por ID:", async () => {		
		const res = await req
			.get("/usuarios/551137c2f9e1fac808a5f572")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(404);
	});

    test("Usuário ID inválido:", async () => {		
		const res = await req
			.get("/usuarios/id-invalido")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(400);
	});

    test("Encontrar pelo nome:", async () => {		
		const res = await req
			.get("/usuarios")
            .query({
                nome: rdn
            })
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.resposta.length).toBeGreaterThanOrEqual(1);

        expect(res.body.resposta[0].nome).toBe(novoUsuario.nome);
	});

    test("Encontrar Todos", async () => {
        let pagina = 1;
        let resultados = 0;
        let totalDocumentos = 0;
        let encontrado = false;
        do {
            const res = await req
                .get("/usuarios")
                .query({
                    pagina: pagina
                })
                .set("Authorization", `Bearer ${token}`)  
                .set("Accept", "aplication/json")
                .expect(200);

            expect(res.body.resposta).toBeDefined();

            resultados = res.body.resposta.length;
            totalDocumentos += resultados;

            for(let usuario of res.body.resposta) {
                if(usuario.id === novoUsuario.id) {
                    encontrado = true;
                } else {
                    if(usuariosQuaisquer.length < 10)
                    usuariosQuaisquer.push(usuario);
                }
            }

            pagina++;
        } while(resultados > 0 && pagina < 1000);

        usuarioQualquer = usuariosQuaisquer[0];

        expect(totalDocumentos).toBeGreaterThanOrEqual(32); // o seed cria 32
        expect(encontrado).toBeTruthy(); // Deve ter encontrado o usuário criado ao atravessar todas as páginas
	});

    test("Atualizar Usuário", async () => {
        const nome = "!"+novoUsuario.nome;
        const biografia = "Teste de Biografia";
        const fotoPerfil = "/img/usuario-outra.png";
        const preferencias = {
            notificacao: false,
            exibirEmail: false,
            contaPrivada: true
        };
		const res = await req
			.patch("/usuarios")
            .send({
                nome: nome,
                biografia: biografia,
                fotoPerfil: fotoPerfil,
                preferencias: preferencias
            })
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.nome).toBe(nome);
        expect(res.body.biografia).toBe(biografia);
        expect(res.body.fotoPerfil).toBe(fotoPerfil);
        expect(res.body.email).toBeUndefined(); // exibirEmail false deve não ter email aqui 
    });

    test("Nome Inválido ao atualizar usuário", async () => {
        const nome = "01234567890123456789012345678901234567890123456789 - Mais de 50 caracteres";

		const res = await req
			.patch("/usuarios")
            .send({
                nome: nome
            })
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(400);

        expect(res.body.validation).toBeDefined();
        expect(res.body.validation.nome).toBeDefined();
    });

    test("Seguir vários usuários", async () => {
        const seguidoresAntes = (await getSeguidoresUsuario(usuarioQualquer.id)).seguidores;

        for(let usuario of usuariosQuaisquer) {
            const res = await req
                .post("/usuarios/"+usuario.id+"/seguir")
                .set("Authorization", `Bearer ${token}`)  
                .set("Accept", "aplication/json")
                .expect(200);
        }

        const seguidoresDepois = (await getSeguidoresUsuario(usuarioQualquer.id)).seguidores;
        const seguindo = (await getSeguidoresUsuario(novoUsuario.id)).seguindo;

        expect(seguidoresDepois).toBe(seguidoresAntes+1);
        expect(seguindo).toBe(usuariosQuaisquer.length);
    });

    test("Tentando seguir usuário inexistente", async () => {
        const res = await req
            .post("/usuarios/551137c2f9e1fac808a5f572/seguir")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(404);
    });

    test("Deixando de seguir usuário inexistente", async () => {
        const res = await req
            .delete("/usuarios/551137c2f9e1fac808a5f572/seguir")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);
        
        expect(res.body.message).toBe("Já tinha deixado de seguir");
    });

    test("Listar seguidores, deve ter 0", async () => {
        const res = await req
			.get("/usuarios/"+novoUsuario.id+"/seguidores")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.resposta).toBeDefined();
        expect(res.body.resposta.length).toBe(0);
    });

    test("Listar seguindo, Deve estar seguindo vários", async () => {
        const res = await req
			.get("/usuarios/"+novoUsuario.id+"/seguindo")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.resposta).toBeDefined();
        expect(res.body.resposta.length).toBe(usuariosQuaisquer.length);

        expect(res.body.resposta[0].id).toBe(usuarioQualquer.id);
    });

    test("Deixar de seguir um usuário", async () => {
        const seguidoresAntes = (await getSeguidoresUsuario(usuarioQualquer.id)).seguidores;

        const res = await req
			.delete("/usuarios/"+usuarioQualquer.id+"/seguir")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        const seguidoresDepois = (await getSeguidoresUsuario(usuarioQualquer.id)).seguidores;
        const seguindo = (await getSeguidoresUsuario(novoUsuario.id)).seguindo;

        expect(seguidoresDepois).toBe(seguidoresAntes-1);
        expect(seguindo).toBe(usuariosQuaisquer.length - 1);
    });

    test("Deletar Usuário sem confirmar a senha", async () => {
		const res = await req
			.delete("/usuarios")
            .send({
                senha: "senha errada"
            })
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(498);
    });

    test("Deletar Usuário", async () => {
		const res = await req
			.delete("/usuarios")
            .send({
                senha: novoUsuario.senha
            })
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);
    });

    test("Tentando utilizar o mesmo token após deletar conta", async () => {
        const res = await req
        .get("/usuarios")
        .set("Authorization", `Bearer ${token}`)  
        .set("Accept", "aplication/json")
        .expect(498);
    });
});