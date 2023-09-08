import {jest,describe,expect,test} from "@jest/globals";

import app from "../../src/app.js";
import request from "supertest";
import { checarArquivoExiste, checarArquivoNaoExiste, postLogin, wrapExpectError } from "../common.js";
import faker from "faker-br";
import { query } from "express";

describe("Teste Postagem",() => {

    const rdn1 = faker.random.alphaNumeric(8); // Para ser único na pesquisa depois
    const rdn2 = faker.random.alphaNumeric(8); // Para ser único na pesquisa depois
    const rdn3Hashtag = faker.random.alphaNumeric(8); // Para ser único na pesquisa depois
    const conteudoPost = `Teste Postagem Simples ${rdn1} ${rdn2} #${rdn3Hashtag}`;
    const rdn4Imagem = faker.random.alphaNumeric(8); // Para ser único na pesquisa depois
    let idPost = false;
    let idPostImagem = false;
    let pathImagemUpload = false;
    const imagemPost = "./test/assets/usuario_wide.jpg";

    let token = false;
	let usuarioAutenticado = false;
	const req = request(app);

    test("Deve autenticar", async () => {
        const res = await postLogin(req).expect(200);
        token = res.body.token;
        usuarioAutenticado = res.body.usuario;
        expect(token).toBeTruthy();
    });

    test("Deve realizar postagem simples", async () => {
		const res = await req
		.post("/postagens")
		.set("Authorization", `Bearer ${token}`)
		.field("conteudo", conteudoPost)
		.expect(201);

        idPost = res.body._id;
    });

    test("Deve realizar postagem de resposta com imagem", async () => {
        const conteudo = `Teste Postagem Com Imagem ${rdn4Imagem}`;
		const res = await req
		.post("/postagens")
		.set("Authorization", `Bearer ${token}`)
		.field("conteudo", conteudo)
        .field("postagemPai", idPost)
        .attach("fotos_post", imagemPost, {
			filename: "foto.jpg" ,
			contentType: "image/jpeg"
		})
		.expect(201);

        idPostImagem = res.body._id;

        expect(res.body.conteudo).toBe(conteudo);
        expect(res.body.imagens.length).toBe(1);

        pathImagemUpload = "."+res.body.imagens[0];
        expect(await checarArquivoExiste(pathImagemUpload)).toBeTruthy();
    });

    test("Curtir Postagem", async () => {
		await req.post("/postagens/"+idPost+"/curtidas")
		.set("Authorization", `Bearer ${token}`)
		.expect(200);

        // Testando indempotência (Curtir o que já está curtido não deveria causar erro)
        await req.post("/postagens/"+idPost+"/curtidas")
		.set("Authorization", `Bearer ${token}`)
		.expect(200);
    });

    test("Postagem por ID", async () => {
		const res = await req
		.get("/postagens/"+idPost)
		.set("Authorization", `Bearer ${token}`)
		.expect(200);
        
        const postagem = res.body;
        
        expect(postagem.conteudo).toBe(conteudoPost);
        expect(postagem.hashtags).toContain("#"+rdn3Hashtag);
        expect(postagem.imagens.length).toBe(0);
        expect(postagem.numRespostas).toBe(1);
        expect(postagem.numCurtidas).toBe(1);
        expect(postagem.curtida).toBe(true);
        expect(postagem.postagemPai).toBeUndefined();
    });

    test("Listar respostas de postagem", async () => {
		const res = await req
		.get("/postagens/"+idPost+"/respostas")
		.set("Authorization", `Bearer ${token}`)
		.expect(200);
        
        expect(res.body.resposta.length).toBe(1);

        const postagem = res.body.resposta[0];
        expect(postagem.postagemPai).toBe(idPost);
    });

    test("Testando filtros de postagem", wrapExpectError(async (status) => {
        const filtros = [
            {path:"/postagens", query:{ pesquisa: rdn1 }, expectId: idPost},
            {path:"/postagens", query:{ pesquisa: `${rdn1} ${rdn2}` }, expectId: idPost},
            {path:"/postagens", query:{ hashtag: `${rdn3Hashtag}` }, expectId: idPost},
            {path:"/usuarios/"+usuarioAutenticado._id+"/postagens", query: { pesquisa: rdn1 }, expectId: idPost},

            {path:"/postagens/"+idPost+"/respostas", query: { queryqualquer: "deveria aceitar qualquer coisa aqui" }, expectId: idPostImagem},
            {path:"/postagens/"+idPost+"/respostas", query: { pesquisa: "teste" }, expectId: idPostImagem},
            {path:"/usuarios/"+usuarioAutenticado._id+"/respostas", query: { pesquisa: rdn4Imagem }, expectId: idPostImagem},

            // Pode ser que tenha vários resultados, mas o primeiro da resposta vai ser o que acabou de ser inserido
            {path:"/usuarios/curtidas", query: { }, expectId: idPost, acceptMultiple: true},
        ];

        for(let filtro of filtros) {
            status.msg = "Testando "+filtro.path+" query:"+JSON.stringify(query);
            const res = await req
            .get(filtro.path)
            .query(filtro.query)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
            
            if(filtro.acceptMultiple) {
                expect(res.body.resposta.length).toBeGreaterThanOrEqual(1);
            } else {
                expect(res.body.resposta.length).toBe(1);
            }

            const postagem = res.body.resposta[0];
            expect(postagem._id).toBe(filtro.expectId);
        }
    }));

    test("Des-curtir Postagem", async () => {
		await req.delete("/postagens/"+idPost+"/curtidas")
		.set("Authorization", `Bearer ${token}`)
		.expect(200);

        // Testando indempotência (Des-curtir o que já está descurtido não deveria causar erro)
        await req.delete("/postagens/"+idPost+"/curtidas")
		.set("Authorization", `Bearer ${token}`)
		.expect(200);
    });

    test("Deletar Postagem com imagem", async () => {
		await req
		.delete("/postagens/"+idPostImagem)
		.set("Authorization", `Bearer ${token}`)
		.expect(200);

        const res = await req
		.get("/postagens/"+idPostImagem)
		.set("Authorization", `Bearer ${token}`)
		.expect(200);
        
        const postagem = res.body;
        expect(postagem.deletado).toBeTruthy();
        expect(postagem.conteudo).toBe("");
        expect(postagem.hashtags).toHaveLength(0);
        expect(postagem.imagens).toHaveLength(0);
        expect(await checarArquivoNaoExiste(pathImagemUpload)).toBeTruthy();
    });
});