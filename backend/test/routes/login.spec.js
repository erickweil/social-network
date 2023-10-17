import {jest,describe,expect,test} from "@jest/globals";

import app from "../../src/app.js";
import request  from "supertest";
import { usuarioTeste } from "../../src/models/Usuario.js";
import { postLogin, wrapExpectError } from "../common.js";


describe("Teste Login", () => {
    let token = false;
	const req = request(app);

	test("Não permitir acessar sem autenticação", wrapExpectError(async (status) => {
		const rotas = [
			{method:"get", path:"/usuarios"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572"},
			{method:"get", path:"/usuarios/logado"},
			{method:"patch", path:"/usuarios"},
			{method:"delete", path:"/usuarios"},
			{method:"post", path:"/usuarios/foto-perfil"},
			{method:"post", path:"/usuarios/foto-capa"},

			{method:"post", path:"/usuarios/551137c2f9e1fac808a5f572/seguir"},
			{method:"delete", path:"/usuarios/551137c2f9e1fac808a5f572/seguir"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572/seguidores"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572/seguindo"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572/contar-seguidores"},

			{method:"get", path:"/postagens"},
			{method:"get", path:"/postagens/551137c2f9e1fac808a5f572"},
			{method:"get", path:"/postagens/551137c2f9e1fac808a5f572/respostas"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572/postagens"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572/respostas"},
			{method:"post", path:"/postagens"},
			{method:"delete", path:"/postagens/551137c2f9e1fac808a5f572"},

			{method:"post", path:"/postagens/551137c2f9e1fac808a5f572/curtidas"},
			{method:"delete", path:"/postagens/551137c2f9e1fac808a5f572/curtidas"},
			{method:"get", path:"/usuarios/curtidas"},
		];

		for(let rota of rotas) {
			status.msg = "Testando "+rota.method+" "+rota.path;
			const res = await req[rota.method](rota.path)
			.set("Accept", "aplication/json")
			.expect(498);
		}
	}), 60000);

	test("Não deve autenticar", wrapExpectError(async (status) => {
		const invalidos = [
			[undefined,undefined],
			["",""],
			[usuarioTeste.email,undefined],
			[undefined,usuarioTeste.senha],
			[usuarioTeste.email,""],
			["",usuarioTeste.senha],
            ["EMAIL ERRADO","SENHA ERRADA"],
			[usuarioTeste.email,"SENHA ERRADA"],
			["EMAIL ERRADO",usuarioTeste.senha],
			[usuarioTeste.email,usuarioTeste.senha+"a"],
			[usuarioTeste.email,"a"+usuarioTeste.senha],
        ];

        for(let logins of invalidos) {
			status.msg = "Testando email:"+logins[0]+" senha:"+logins[1];
			await postLogin(req,{
					email: logins[0],
					senha: logins[1],
				})
				.expect(400);
		}
    }));

    test("Deve autenticar", async () => {
        const res = await postLogin(req,usuarioTeste).expect(200);
        expect(res.body.token).toBeTruthy();
		token = res.body.token;
    });

	test("Não permitir acessar com token inválido/expirado", wrapExpectError(async (status) => {
		const tokens = [
			undefined,
			"",
			"token invalido",	
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTA4YjM5ZDI4NDY5YjBkZDA2OTA4NSIsIm5vbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2ODgzMDI4MDksImV4cCI6MTY4ODMxMDAwOX0.AvO7gRoXITdxHinc8-1eUTYE_1dq30UqtcU45dj0TBQ",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTA4YjM5ZDI4NDY5YjBkZDA2OTA4NSIsIm5vbWUiOiJKb8OjbyIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2ODgzMDU4NzQsImV4cCI6MTY4ODMxMzA3NH0.ZV-bM6snJvSqqWZ7TLAIj_EMOae8gofw3bF7aiJ2G9o",
			token+"a",
			"a"+token,
			token.replace("a","b"),
			token.toUpperCase()
		];

		for(let t of tokens) {
			status.msg = "Testando token:'"+t+"'";
			const res = await req.get("/usuarios")
			.set("Accept", "aplication/json")
            .set("Authorization", `Bearer ${t}`)  
			.expect(498);
		}
	}));
});