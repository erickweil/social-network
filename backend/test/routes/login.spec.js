import {jest,describe,expect,test} from "@jest/globals";

import app from "../../src/app.js";
import request  from "supertest";
import { usuarioTeste } from "../../src/models/Usuario.js";

describe("Teste Login",() => {
    let token = false;
	const req = request(app);

	test("Não permitir acessar sem autenticação", async () => {
		const rotas = [
			{method:"get", path:"/usuarios"},
			{method:"get", path:"/usuarios/551137c2f9e1fac808a5f572"},
			{method:"patch", path:"/usuarios"}
		];

		for(let rota of rotas) {
			const res = await req[rota.method](rota.path)
			.set("Accept", "aplication/json")
			.expect(498);
		}
	});

	test("Não deve autenticar", async () => {
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
			const res = await req
				.post("/login")
				.set("Accept", "aplication/json")
				.send({
					email: logins[0],
					senha: logins[1],
				})
				.expect(400);
		}
    });

    test("Deve autenticar", async () => {
        const res = await req
            .post("/login")
            .set("Accept", "aplication/json")
            .send({
                email: usuarioTeste.email,
                senha: usuarioTeste.senha,
            })
            .expect(200);

        token = res.body.token;
        expect(token).toBeTruthy();
    });

	test("Não permitir acessar com token inválido/expirado", async () => {
		const tokens = [
			undefined,
			"",
			"token invalido",	
			// vai expirar "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTA4YjM5ZDI4NDY5YjBkZDA2OTA4NSIsIm5vbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2ODgzMDI4MDksImV4cCI6MTY4ODMxMDAwOX0.AvO7gRoXITdxHinc8-1eUTYE_1dq30UqtcU45dj0TBQ",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTA4YjM5ZDI4NDY5YjBkZDA2OTA4NSIsIm5vbWUiOiJKb8OjbyIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2ODgzMDU4NzQsImV4cCI6MTY4ODMxMzA3NH0.ZV-bM6snJvSqqWZ7TLAIj_EMOae8gofw3bF7aiJ2G9o",
			token+"a",
			"a"+token,
			token.replace("a","b"),
			token.toUpperCase()
		];

		for(let t of tokens) {
			const res = await req.get("/usuarios")
			.set("Accept", "aplication/json")
            .set("Authorization", `Bearer ${t}`)  
			.expect(498);
		}
	});

	// Outros testes:
	// teste deletar usuário e tentar usar token do usuário inexistente para acessar algo
});