import {jest,describe,expect,test} from "@jest/globals";

import app from "../../src/app.js";
import request  from "supertest";
import { deletarUsuario, getUsuarioPorID, postCriarUsuario, postLogin } from "../common.js";
import { stat } from "fs/promises";

describe("Usuarios",() => {
    let token = false;
	let usuarioAutenticado = false;
	const req = request(app);
	//const req = request("http://localhost:8080");

    test("Deve autenticar", async () => {
        const res = await postLogin(req).expect(200);
        token = res.body.token;
		usuarioAutenticado = res.body.usuario;
        expect(token).toBeTruthy();
    });

	// Testando rota /usuarios/foto-perfil
	test("Deve atualizar foto de perfil", async () => {
		const fotos = [
			{path:"./test/assets/usuario.jpg", mimeType: "image/jpeg", expectSuccess: true},
			{path:"./test/assets/usuario.png", mimeType: "image/png", expectSuccess: true},
			{path:"./test/assets/usuario.webp", mimeType: "image/webp", expectSuccess: true},
			{path:"./test/assets/usuario.gif", mimeType: "image/gif", expectSuccess: true},
			{path:"./test/assets/imagem_4k.jpg", mimeType: "image/jpeg", expectSuccess: true},
			{path:"./test/assets/imagem_4k.png", mimeType: "image/png", expectSuccess: false},
			{path:"./test/assets/usuario.bmp", mimeType: "image/bmp", expectSuccess: false},
			{path:"./test/assets/usuario.tiff", mimeType: "image/tiff", expectSuccess: false},
			{path:"./test/assets/usuario.avif", mimeType: "image/avif", expectSuccess: false},
		];

		let fotoAnterior = false;
		for(const foto of fotos) {
			const filename = foto.path.substring(foto.path.lastIndexOf("/")+1);
			const res = await req
				.post("/usuarios/foto-perfil")
				.set("Authorization", `Bearer ${token}`)
				.attach("foto_perfil", foto.path, {
					filename: filename ,
					contentType: foto.mimeType
				})
				.expect(foto.expectSuccess ? 200 : 500);

			if(foto.expectSuccess) {
				expect(res.body.fotoPerfil).toBeTruthy();
				const fotoPerfil = res.body.fotoPerfil;

				//checar se caminho existe
				const fotoStat = await stat("./public"+fotoPerfil);
				expect(fotoStat.isFile()).toBeTruthy();

				// Verificar se tamanho é maior que 0
				expect(fotoStat.size).toBeGreaterThan(0);

				// Verificar se foto anterior foi deletada
				if(fotoAnterior) {
					// verificar que não existe mais
					let err = undefined;
					try {
						const fotoAnteriorStat = await stat("./public"+fotoAnterior);
					} catch(e) {
						err = e;
					}
					expect(err).toBeTruthy();
					expect(err.code).toBe("ENOENT");
				}
				fotoAnterior = fotoPerfil;
			} else {
				expect(res.body.fotoPerfil).toBeUndefined();
			}
		}
	}, 60000);

	test("Não deve ser possível atualizar foto via patch /usuarios", async () => {
		const res = await req
			.patch("/usuarios")
			.send({
				fotoCapa: "/img/"+usuarioAutenticado.id+"/4d095a193e563ded.gif"
			})
			.set("Authorization", `Bearer ${token}`)  
			.set("Accept", "aplication/json")
			.expect(400);

		expect(res.body.error).toBeTruthy();
    });
});