import { usuarioTeste } from "../src/models/Usuario.js";
import { stat } from "fs/promises";

export const postLogin = (req,usuario) => {
	return req
	.post("/login")
	.set("Accept", "aplication/json")
	.send({
		email: usuario ? usuario.email : usuarioTeste.email,
		senha: usuario ? usuario.senha : usuarioTeste.senha,
	});
};

export const getUsuarioPorID = (req,token,id) => {
    return req
    .get("/usuarios/"+id)
    .set("Authorization", `Bearer ${token}`)  
    .set("Accept", "aplication/json");
};

export const postCriarUsuario = (req,novoUsuario) => {
    return req
    .post("/usuarios")
    .set("Accept", "aplication/json")
    .send(novoUsuario);
};

export const getSeguidoresUsuario = (req,token,id) => {
    return req
    .get("/usuarios/"+id+"/contar-seguidores")
    .set("Authorization", `Bearer ${token}`)  
    .set("Accept", "aplication/json");
};

export const deletarUsuario = (req,token,senha) => {
    return req
    .delete("/usuarios")
    .send({
        senha: senha
    })
    .set("Authorization", `Bearer ${token}`)  
    .set("Accept", "aplication/json");
};

export const checarArquivoExiste = async (filepath) => {
    //checar se caminho existe
    const fotoStat = await stat(filepath);
    return fotoStat.isFile() && fotoStat.size > 0;
};

export const checarArquivoNaoExiste = async (filepath) => {
    // verificar que não existe mais
    let err = undefined;
    try {
        await stat(filepath);
    } catch(e) {
        err = e;
    }
    return err && err.code == "ENOENT";
};

// Para ser possível saber qual dos trocentos casos de teste falharam
export const wrapExpectError = (fn) => {
    return async () => {
        const statusObj = {};
        try {
            await fn(statusObj);
        } catch(err) {
            if(statusObj.msg) {
                throw new Error(statusObj.msg, {cause: err});
            }
            else throw err;
        }
    };
};