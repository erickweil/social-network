import {jest,describe,expect,test} from "@jest/globals";

import faker from "faker-br";
import app from "../../src/app.js";
import request  from "supertest";

describe("Usuarios",() => {
	
    const rdn = faker.random.alphaNumeric(8); // Para ser único na pesquisa depois
    const novoUsuario = {
		nome: rdn+"Tèşt€жぁ書😎⍨.̶̡̨̳̝͓͚̲͇͖̥͓̄͂͆̀̏̑̒̃̄̽̿̍͘͝.",
		email: rdn+"@teste.com",
        senha:"ABCDabcd1234"
	};
    let token = false;
	const req = request(app);

    test("Criar usuario senha fraca:", async () => {		
		const res = await req
            .post("/usuarios")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .send({...novoUsuario,...{
                senha:"12345678"
            }})
            .expect(400);

        expect(res.body.validation).toBeDefined();
        expect(res.body.validation.senha).toBeDefined();
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
		const res = await req
			.get("/usuarios/"+novoUsuario.id)
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.id).toBe(novoUsuario.id);
        expect(res.body.nome).toBe(novoUsuario.nome);
        expect(res.body.nomeASCII).toBeDefined();
        expect(res.body.email).toBe(novoUsuario.email);
        expect(res.body.fotoPerfil).toBeDefined();
        expect(res.body.biografia).toBeDefined();
        expect(res.body.senha).toBeUndefined();
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
                nome: rdn+"teste"
            })
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.resposta.length).toBeGreaterThanOrEqual(1);

        expect(res.body.resposta[0].nome).toBe(novoUsuario.nome);
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
        expect(res.body.nomeASCII.startsWith("!")).toBeTruthy(); // verificar que atualizou o nome ASCII também
        expect(res.body.biografia).toBe(biografia);
        expect(res.body.fotoPerfil).toBe(fotoPerfil);
        expect(res.body.email).toBeUndefined(); // exibirEmail false deve não ter email aqui 
    });
});