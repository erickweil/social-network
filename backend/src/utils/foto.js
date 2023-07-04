import { randomUUID } from "crypto";
import { unlink, mkdir, writeFile, rename } from "fs/promises";

import formidable from "formidable";

const acceptableFormats = {
    "image/gif":    ".gif",
    "image/jpeg":	".jpg",
    "image/jpg":	".jpg",
    "image/png":    ".png",
    "image/webp":   ".webp"
};

// Produz erro se não salvar, retorna caminho no formato /img/<ObjectID>/<UUID>.(jpg|png|gif|webp)
export const salvarFotoUsuario = async (imgFile, usuario) => {
    let sucesso = false;
    try {
        const fileExtension = acceptableFormats[imgFile.mimetype]; // já foi checado pelo filter

        const uuid = randomUUID();
        const filedir = "public/img/"+usuario.id;
        await mkdir(filedir,{recursive: true});

        const filename = uuid+fileExtension;
        await rename(imgFile.filepath,filedir+"/"+filename);

        // retorna caminho relativo à pasta public
        sucesso = true;
        return "/img/"+usuario.id+"/"+filename;
    } finally {
        if(!sucesso) try {
            unlink(imgFile.filepath); // deleta arquivo em caso de algum erro
        } catch(e) {
            console.log(e);
        }
    }
};

// Não produz erro, apenas retorna verdadeiro se tiver deletado
export const deletarFotoUsuario = async (idUsuario,filepath) => {
	if(!filepath) {console.log("Arquivo não existe"); return false;}
	try{
		// Verificar se o caminho é uma foto de perfil/capa do usuário informado
		// Não é possível deletar algo que não é do usuário
		const matches = filepath.match(/^\/img\/([a-fA-F0-9]{24})\/[a-fA-F0-9\-]+\.(jpg|png|gif|webp)$/);
		if(!matches || !matches[1] || idUsuario != matches[1]) {
            // só fazer log quando for importante
            if(filepath != "/img/usuario-default.png" && filepath != "/img/usuario-capa-default.png")
			console.log("Usuário não tem permissão para deletar: "+filepath);

			return false;
		}

		const caminhoFoto = "./public"+filepath;
		await unlink(caminhoFoto);
		return true;
	} catch(e) {
		console.log(e);
		return false;
	}
};

// NÃO UTILIZAR MULTER
// https://picnature.de/how-to-upload-files-in-nodejs-using-multer-2-0/
// https://github.com/expressjs/multer/tree/v2.0.0-rc.4
//export const upload = multer({
    //limits: {
    //    fileSize: "8MB"
    //}
//});

// Usando formidable para upload de arquivos
// https://github.com/node-formidable/formidable
const form = formidable({ 
    maxFiles: 1,
    maxFileSize: 8 * 1024 * 1024, // 8MB
    uploadDir: "./tmpimg",
    filter: function ({name, originalFilename, mimetype}) {
        if(!mimetype || !acceptableFormats[mimetype]) {
            //form.emit("error", new formidableErrors.default("invalid type", 0, 400)); // optional make form.parse error
            return false;
        }
        return true;
    }
});

export const upload = { 
	single: (key) => async (req,res,next) => {
        const [fields, files] = await form.parse(req);
        // Verificar se key está em files
        if(files && files[key] !== undefined && files[key].length === 1) {
            req.file = files[key][0];
        }
        next();
	}
};