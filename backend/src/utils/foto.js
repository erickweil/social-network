import { randomUUID } from "crypto";
import { unlink, mkdir, writeFile, rename, readFile } from "fs/promises";

import formidable from "formidable";
import sharp from "sharp";

const acceptableFormats = {
    "image/gif":    ".gif",
    "image/jpeg":	".jpg",
    "image/jpg":	".jpg",
    "image/png":    ".png",
    "image/webp":   ".webp"
};


async function copiarSanitizandoImagem(filepath,outfilepath,opcoes) {
    const opcoesPadrao = {
        maxWidth: 1024,
        maxHeight: 1024,
        minWidth: 150,
        minHeight: 150,
        minAspectRatio: 0.5,
        maxAspectRatio: 2.5,
        quality: 80,
        format: "jpeg"
    };
    opcoes = {...opcoesPadrao,...opcoes};

    // NÃO LER USANDO SHARP PORQUE NÃO TEM COMO DELETAR DEPOIS https://github.com/lovell/sharp/issues/346
    const data = await readFile(filepath);
    let image = sharp(data);
    const metadata = await image.metadata();
    const aspectRatio = metadata.width / metadata.height;
    // https://sharp.pixelplumbing.com/api-resize
    if(aspectRatio > opcoes.maxAspectRatio || aspectRatio < opcoes.minAspectRatio) {
        // imagem muito larga ou muito alta
        let imgWidth = metadata.width;
        if(imgWidth > opcoes.maxWidth) imgWidth = opcoes.maxWidth;
        if(imgWidth < opcoes.minWidth) imgWidth = opcoes.minWidth;
        let imgHeight = metadata.height;
        if(imgHeight > opcoes.maxHeight) imgHeight = opcoes.maxHeight;
        if(imgHeight < opcoes.minHeight) imgHeight = opcoes.minHeight;
        image = image.resize( imgWidth,imgHeight, {
            // Preserving aspect ratio, attempt to ensure the image covers both provided dimensions by cropping/clipping to fit.
            fit: sharp.fit.cover,
        });
    }
    else if(metadata.width > opcoes.maxWidth || metadata.height > opcoes.maxHeight) {
        image = image.resize( opcoes.maxWidth,opcoes.maxHeight, {
            // Preserving aspect ratio, resize the image to be as large as possible while ensuring 
            // its dimensions are less than or equal to both those specified
            fit: sharp.fit.inside,
        });
    }
    else if(metadata.width < opcoes.minWidth || metadata.height < opcoes.minHeight) {
        image = image.resize( opcoes.minWidth,opcoes.minHeight, {
            // Preserving aspect ratio, resize the image to be as small as possible while ensuring
            // its dimensions are greater than or equal to both those specified. 
            // Some of these values are based on the object-fit CSS property.
            fit: sharp.fit.outside,
        });
    }

    return await image
    .rotate() // auto-rotate based on the EXIF Orientation tag
    .jpeg({ quality: opcoes.quality })
    .toFile(outfilepath);
}

// Produz erro se não salvar, retorna caminho no formato /img/<ObjectID>/<UUID>.(jpg|png|gif|webp)
export const salvarFotoUsuario = async (imgFile, usuario) => {
    try {
        const uuid = randomUUID();
        const filedir = "public/img/"+usuario.id;
        await mkdir(filedir,{recursive: true});

        const filename = uuid+".jpg";
        //await rename(imgFile.filepath,filedir+"/"+filename);
        await copiarSanitizandoImagem(imgFile.filepath,filedir+"/"+filename,{format: "jpeg"});

        // retorna caminho relativo à pasta public
        return "/img/"+usuario.id+"/"+filename;
    } finally {
        try {
            await unlink(imgFile.filepath); // deleta arquivo em caso de algum erro
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
await mkdir("./tmpimg",{recursive: true});
export const upload = { 
	single: (key) => async (req,res,next) => {
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
        const [fields, files] = await form.parse(req);
        // Verificar se key está em files
        if(files && files[key] !== undefined && files[key].length === 1) {
            req.file = files[key][0];
        }
        next();
	}
};