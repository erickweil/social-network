import {jest,describe,expect,test} from "@jest/globals";

import faker from "faker-br";
import app from "../../src/app.js";
import request  from "supertest";
import { deletarUsuario, getSeguidoresUsuario, postCriarUsuario, postLogin } from "../common.js";

describe("Seguidor",() => {
    const usuariosTeste = [];
    let usuarioQualquer = false;
    let token = false;
    let usuarioAutenticado = false;
	const req = request(app);
    
    test("Criar usuários teste", async () => {
        for(let i = 0; i < 10; i++) {
            const res = await postCriarUsuario(req,{
                nome: "Seguidor - Nº"+i,
                email: faker.internet.email(),
                senha: "ABCDabcd1234",
            })
            .expect(201);

            usuariosTeste.push(res.body);
        }

        usuarioQualquer = usuariosTeste[0];
    }, 60000);

    test("Deve autenticar", async () => {
        const testeUsuario = {
            nome: "Seguidor - Usuario Teste",
            email: faker.internet.email(),
            senha: "ABCDabcd1234",
        };

        const res = await postCriarUsuario(req,testeUsuario)
        .expect(201);

        const res2 = await postLogin(req,testeUsuario).expect(200);
        token = res2.body.token;
        usuarioAutenticado = res2.body.usuario;
    });


    test("Seguir vários usuários", async () => {
        const seguidoresAntes = (await getSeguidoresUsuario(req,token,usuarioQualquer._id).expect(200)).body;

        for(let usuario of usuariosTeste) {
            const res = await req
                .post("/usuarios/"+usuario._id+"/seguir")
                .set("Authorization", `Bearer ${token}`)  
                .set("Accept", "aplication/json")
                .expect(200);
        }

        const seguidoresDepois = (await getSeguidoresUsuario(req,token,usuarioQualquer._id).expect(200)).body;
        const seguindoDepois = (await getSeguidoresUsuario(req,token,usuarioAutenticado._id).expect(200)).body;

        expect(seguidoresDepois.seguidores).toBe(seguidoresAntes.seguidores+1);
        expect(seguindoDepois.seguindo).toBe(usuariosTeste.length);
    });

    test("Listar seguidores, deve ter 0", async () => {
        const res = await req
			.get("/usuarios/"+usuarioAutenticado._id+"/seguidores")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.resposta).toBeDefined();
        expect(res.body.resposta.length).toBe(0);
    });

    test("Listar seguindo, Deve estar seguindo vários", async () => {
        const res = await req
			.get("/usuarios/"+usuarioAutenticado._id+"/seguindo")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        expect(res.body.resposta).toBeDefined();
        expect(res.body.resposta.length).toBe(usuariosTeste.length);

        expect(res.body.resposta[0]._id).toBe(usuarioQualquer._id);
    });

    test("Deixar de seguir um usuário", async () => {
        const seguidoresAntes = (await getSeguidoresUsuario(req,token,usuarioQualquer._id).expect(200)).body;

        const res = await req
			.delete("/usuarios/"+usuarioQualquer._id+"/seguir")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);

        const seguidoresDepois = (await getSeguidoresUsuario(req,token,usuarioQualquer._id).expect(200)).body;
        const seguindoDepois = (await getSeguidoresUsuario(req,token,usuarioAutenticado._id).expect(200)).body;

        expect(seguidoresDepois.seguidores).toBe(seguidoresAntes.seguidores-1);
        expect(seguindoDepois.seguindo).toBe(usuariosTeste.length - 1);
    });

    test("Verificando 0 seguidores após deletar usuário", async () => {
		let res = await deletarUsuario(req,token,"ABCDabcd1234").expect(200);

        res = await postLogin(req).expect(200);
        token = res.body.token;

        res = await getSeguidoresUsuario(req,token,usuarioAutenticado._id).expect(200);
        expect(res.body.seguidores).toBe(0);
        expect(res.body.seguindo).toBe(0);
    });

    test("Tentando seguir usuário inexistente", async () => {
        const res = await req
            .post("/usuarios/"+usuarioAutenticado._id+"/seguir")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(404);
    });

    test("Deixando de seguir usuário inexistente", async () => {
        const res = await req
            .delete("/usuarios/"+usuarioAutenticado._id+"/seguir")
            .set("Authorization", `Bearer ${token}`)  
            .set("Accept", "aplication/json")
            .expect(200);
        
        expect(res.body.message).toBe("Já tinha deixado de seguir");
    });

    test("Deletando usuários teste", async () => {
        for(let i = 1; i < usuariosTeste.length; i++) {
            let res = await postLogin(req,{
                email: usuariosTeste[i].email,
                senha: "ABCDabcd1234"
            }).expect(200);
            res = await deletarUsuario(req,res.body.token,"ABCDabcd1234").expect(200);
        }
    }, 60000);
});