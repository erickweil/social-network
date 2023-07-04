import { randomUUID } from "crypto";
import { unlink, mkdir, writeFile } from "fs/promises";


const acceptableFormats = {
    "image/gif":    ".gif",
    "image/jpeg":	".jpg",
    "image/jpg":	".jpg",
    "image/png":    ".png",
    "image/webp":   ".webp"
};

// Produz erro se não salvar, retorna caminho no formato /img/<ObjectID>/<UUID>.(jpg|png|gif|webp)
export const salvarFotoUsuario = async (imgFile, mimeType, usuario) => {
    if(!usuario || !usuario.id) {
        throw new Error("É necessário estar autenticado");
    }

    const fileExtension = acceptableFormats[mimeType];
    if(!fileExtension) {
        throw new Error("Imagens só podem ser nos formatos: gif, jpg, png, webp");
    }

    const uuid = randomUUID();
    const filedir = "public/img/"+usuario.id;

    await mkdir(filedir,{recursive: true});

    const filename = uuid+fileExtension;
	await writeFile(filedir+"/"+filename, imgFile);
    //await pipeline(
    //    imgFile.stream,
    //    createWriteStream(filedir+"/"+filename)
    //);

    // retorna caminho relativo à pasta public
    return "/img/"+usuario.id+"/"+filename;
};

// Não produz erro, apenas retorna verdadeiro se tiver deletado
export const deletarFotoUsuario = async (idUsuario,filepath) => {
	if(!filepath) {console.log("Arquivo não existe"); return false;}
	try{
		// Verificar se o caminho é uma foto de perfil/capa do usuário informado
		// Não é possível deletar algo que não é do usuário
		const matches = filepath.match(/^\/img\/([a-fA-F0-9]{24})\/[a-fA-F0-9\-]+\.(jpg|png|gif|webp)$/);
		if(!matches || !matches[1] || idUsuario != matches[1]) {
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

// MOCK
export const upload = { 
	single: (key) => async (req,res,next) => {
		req.file = "Conteúdo do arquivo:"+key;
		next();
	}
};