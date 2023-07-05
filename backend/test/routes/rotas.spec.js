import {jest,describe,expect,test} from "@jest/globals";

import app from "../../src/app.js";
import request from "supertest";

describe("Teste Rotas",() => {

	const req = request(app);

	test("Receber mensagem", async () => {
		const mensagemEnviada = "Oi tudo bem?";
		const resp = await req.get("/teste")
			.set("Accept", "aplication/json")  
			.query({msg: mensagemEnviada})
			.expect("content-type", /json/)	  
			.expect(200);

		let mensagemRecebida = resp.body.body.msg;

		expect(mensagemRecebida).toBe(mensagemEnviada);
	});

	test("Swagger redirect", async () => {
		const resp = await req.get("/")
			.expect(302);

		expect(resp.header["location"]).toBe("docs");
	});

	test("Deve Não encontrar", async () => {
		const resp = await req.get("/rota-inexistente").expect(404);
	});
});
