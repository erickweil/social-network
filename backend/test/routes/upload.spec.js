import {jest,describe,expect,test} from "@jest/globals";

import app from "../../src/app.js";
import request  from "supertest";
import { deletarUsuario, getUsuarioPorID, postCriarUsuario, postLogin, wrapExpectError } from "../common.js";
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

	const expectArquivoExiste = async (filepath) => {
		//checar se caminho existe
		const fotoStat = await stat(filepath);
		expect(fotoStat.isFile()).toBeTruthy();

		// Verificar se tamanho é maior que 0
		expect(fotoStat.size).toBeGreaterThan(0);
	};

	const expectArquivoNaoExiste = async (filepath) => {
		// verificar que não existe mais
		let err = undefined;
		try {
			await stat(filepath);
		} catch(e) {
			err = e;
		}
		expect(err).toBeTruthy();
		expect(err.code).toBe("ENOENT");
	};


	const checarUploadCorreto = async (foto,fotoAnterior,perfil) => {
		const filename = foto.path.substring(foto.path.lastIndexOf("/")+1);
		const res = await req
		.post(perfil ? "/usuarios/foto-perfil" : "/usuarios/foto-capa")
		.set("Authorization", `Bearer ${token}`)
		.attach(perfil ? "foto_perfil" : "foto_capa", foto.path, {
			filename: filename ,
			contentType: foto.mimeType
		})
		.expect(foto.expectCode);

		if(foto.expectCode == 200) {
			// Se espera sucesso, verificar imagem criada e anterior deletada
			expect(res.body.fotoPerfil).toBeTruthy();
			const fotoPerfil = res.body.fotoPerfil;

			await expectArquivoExiste("."+fotoPerfil);

			// Verificar se foto anterior foi deletada
			if(fotoAnterior) {
				expectArquivoNaoExiste("."+fotoAnterior);
			}

			return fotoPerfil;
		} else {
			// Se não espera sucesso, verifica que não salvou nenhuma imagem
			expect(res.body.fotoPerfil).toBeUndefined();
			return fotoAnterior;
		}
	};
	// Testando rota /usuarios/foto-perfil
	test("Deve atualizar foto de perfil e capa", wrapExpectError(async (status) => {
		const fotos = [
			{path:"./test/assets/usuario.jpg", mimeType: "image/jpeg", expectCode: 200},
			{path:"./test/assets/usuario.png", mimeType: "image/png", expectCode: 200},
			{path:"./test/assets/usuario.webp", mimeType: "image/webp", expectCode: 200},
			{path:"./test/assets/usuario.gif", mimeType: "image/gif", expectCode: 200},
			{path:"./test/assets/imagem_500kb.jpg", mimeType: "image/jpeg", expectCode: 200},
			{path:"./test/assets/usuario_tall.jpg", mimeType: "image/jpeg", expectCode: 200},
			{path:"./test/assets/usuario_big.jpg", mimeType: "image/jpeg", expectCode: 200},
			{path:"./test/assets/usuario_small.jpg", mimeType: "image/jpeg", expectCode: 200},
			{path:"./test/assets/usuario_wide.jpg", mimeType: "image/jpeg", expectCode: 200},
			{path:"./test/assets/png_transparente.png", mimeType: "image/png", expectCode: 200},
			{path:"./test/assets/gif_animado.gif", mimeType: "image/gif", expectCode: 200},
			{path:"./test/assets/usuario.bmp", mimeType: "image/bmp", expectCode: 400},
			{path:"./test/assets/usuario.tiff", mimeType: "image/tiff", expectCode: 400},
			{path:"./test/assets/usuario.avif", mimeType: "image/avif", expectCode: 400},
			{path:"./test/assets/texto_salvo_errado.jpg", mimeType: "image/jpeg", expectCode: 500},
			{path:"./test/assets/corrompido.png", mimeType: "image/png", expectCode: 500},
		];

		let fotoPerfilAnterior = false;
		let fotoCapaAnterior = false;
		for(const foto of fotos) {
			status.msg = "Testando foto do perfil '"+foto.path+"'";
			fotoPerfilAnterior = await checarUploadCorreto(foto,fotoPerfilAnterior,true);
			status.msg = "Testando foto da capa '"+foto.path+"'";
			fotoCapaAnterior = await checarUploadCorreto(foto,fotoCapaAnterior,false);
		}
	}), 120000);

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

	// O que falta:
	// Testar imagens com tamanho muito grande (> 8MB)
	// Testar enviar mensagem escondida via imagem
	//  - metadados,
	//	- steganografia
	//	- arquivo após fim da imagem,
});