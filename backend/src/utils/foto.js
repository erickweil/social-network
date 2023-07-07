import { randomUUID } from "crypto";
import { unlink, mkdir, writeFile, rename, readFile } from "fs/promises";

import formidable from "formidable";
import sharp from "sharp";
import mongoose from "mongoose";
import path from "path";

const acceptableFormats = {
    "image/gif":    ".gif",
    "image/jpeg":	".jpg",
    "image/jpg":	".jpg",
    "image/png":    ".png",
    "image/webp":   ".webp"
};

const fotoPathRegex = /^\/img\/([a-fA-F0-9]{24})\/[a-fA-F0-9\-]+\.jpg$/;
const fotoDir = process.env.IMG_PATH || "."; // para ter as imagens em outro caminho além de /img
const tmpFotoDir = fotoDir+"/tmpimg"; // Onde as imagens são salvas temporariamente

async function copiarSanitizandoImagem(filepath,outfilepath,opcoes) {
    const opcoesPadrao = {
        maxWidth: 1024,
        maxHeight: 1024,
        minWidth: 150,
        minHeight: 150,
        minAspectRatio: 9.0/16.0, // wide screen de pé (padrão celulares)
        maxAspectRatio: 21.0/9.0, // ultra wide screen
        quality: 80,
        format: "jpeg"
    };
    opcoes = {...opcoesPadrao,...opcoes};

    // NÃO LER USANDO SHARP PORQUE NÃO TEM COMO DELETAR DEPOIS https://github.com/lovell/sharp/issues/346
    const data = await readFile(filepath);
    let image = sharp(data);
    const metadata = await image.metadata();
    
    // imagem muito larga ou muito alta
    let imgWidth = metadata.width;
    let imgHeight = metadata.height;
    const aspectRatio = imgWidth / imgHeight;
    // https://sharp.pixelplumbing.com/api-resize

    // A ideia é fazer um 'crop' na imagem se ela é muito estreita ou larga
    if(aspectRatio > opcoes.maxAspectRatio || aspectRatio < opcoes.minAspectRatio) {
        let newAspectRatio = Math.max(Math.min(aspectRatio,opcoes.maxAspectRatio),opcoes.minAspectRatio);

        let adjustedSize = {width: imgWidth, height: imgHeight};
        if(newAspectRatio < aspectRatio) { 
            // Estava muito largo
            // Deve cortar mantendo a mesma altura
            adjustedSize.width = Math.floor(imgHeight * newAspectRatio);
        }
        else if(newAspectRatio > aspectRatio) {
            // Estava muito estreito
            // Deve cortar mantendo a mesma largura
            adjustedSize.height = Math.floor(imgWidth / newAspectRatio);
        }

        let crop = {left: 0, top: 0, width: imgWidth, height: imgHeight};
        if(adjustedSize.width < imgWidth) {
            crop.left = Math.floor((imgWidth - adjustedSize.width) / 2.0);
            crop.width = adjustedSize.width;

            image = image.extract(crop);
        }
        else if(adjustedSize.height < imgHeight) {
            crop.top = Math.floor((imgHeight - adjustedSize.height) / 2.0);
            crop.height = adjustedSize.height;

            image = image.extract(crop);
        }

        imgWidth = adjustedSize.width;
        imgHeight = adjustedSize.height;
    }
    
    if(imgWidth > opcoes.maxWidth || imgHeight > opcoes.maxHeight) {
        image = image.resize( opcoes.maxWidth, opcoes.maxHeight, {
            // Preserving aspect ratio, resize the image to be as large as possible while ensuring 
            // its dimensions are less than or equal to both those specified
            fit: sharp.fit.inside,
        });
    }
    else if(imgWidth < opcoes.minWidth || imgHeight < opcoes.minHeight) {
        image = image.resize( opcoes.minWidth, opcoes.minHeight, {
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

// Produz erro se não salvar, retorna caminho no formato /img/<ObjectID>/<UUID>.jpg
export const salvarFotoUsuario = async (imgFile, usuario, opcoes) => {
    try {
        const uuid = randomUUID();
        const filedir = fotoDir+"/img/"+usuario.id;
        await mkdir(filedir,{recursive: true});

        // Sempre será salvo como jpg, 
        // E mesmo que a imagem enviada seja jpg, será salva denovo causando uma recompressão.
        const filename = uuid+".jpg";
        
        opcoes = {...{format: "jpeg"},...opcoes};
        await copiarSanitizandoImagem(imgFile.filepath,filedir+"/"+filename,opcoes);

        // retorna caminho relativo à pasta public
        return "/img/"+usuario.id+"/"+filename;
    } finally {
        try {
            await unlink(imgFile.filepath); // deleta arquivo temporário
        } catch(e) {
            console.log(e);
        }
    }
};

// Não produz erro, apenas retorna verdadeiro se tiver deletado
export const deletarFotoUsuario = async (idUsuario,filepath) => {
	if(!filepath) {return false;} // não há arquivo a ser deletado
	try{
		// Verificar se o caminho é uma foto de perfil/capa do usuário informado
		// Não é possível deletar algo que não é do usuário
		const matches = filepath.match(fotoPathRegex);
		if(!matches || !matches[1] || idUsuario != matches[1]) {
			console.log("Usuário não tem permissão para deletar: "+filepath);

			return false;
		}

		const caminhoFoto = fotoDir+filepath;
		await unlink(caminhoFoto);
		return true;
	} catch(e) {
		console.log(e);
		return false;
	}
};

export const getImagem = async (req, res) => {
    const idUsuario = req.params.id;
    const filename = req.params.img;
    const filepath = "/img/"+idUsuario+"/"+filename;
    const matches = filepath.match(fotoPathRegex);
    if(!matches || !matches[1]) {
        return res.status(400).json({ error: true, message: "Caminho inválido" });
    }

	if(mongoose.Types.ObjectId.isValid(idUsuario) === false)
        return res.status(400).json({ error: true, message: "ID inválido" });
    
	return res.status(200)
		.sendFile(fotoDir+filepath,{
			root: path.resolve()
		});
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
if(fotoDir != ".")
await mkdir(fotoDir,{recursive: true});
if(tmpFotoDir != ".")
await mkdir(tmpFotoDir,{recursive: true});

const filterMimeType = ({name, originalFilename, mimetype}) => {
    if(!mimetype || !acceptableFormats[mimetype]) {
        //form.emit("error", new formidableErrors.default("invalid type", 0, 400)); // optional make form.parse error
        return false;
    }
    return true;
};

const defaultFormidableOptions = { 
    maxFiles: 8,
    maxFileSize: 8 * 1024 * 1024, // 8MB
    uploadDir: tmpFotoDir,
    filter: filterMimeType
};

export const upload = { 
	single: (key) => async (req,res,next) => {
        const form = formidable({...defaultFormidableOptions,...{maxFiles: 1}});
        const [fields, files] = await form.parse(req);
        // Verificar se key está em files
        if(files && files[key] !== undefined && files[key].length === 1) {
            req.file = files[key][0];
        }
        req.fields = fields;
        next();
	},

    multiple: (key) => async (req,res,next) => {
        const form = formidable(defaultFormidableOptions);
        const [fields, files] = await form.parse(req);
        // Verificar se key está em files
        if(files && files[key] !== undefined && files[key].length > 0) {
            req.files = files[key];
        }
        req.fields = fields;

        //console.log(req.files);
        //console.log(req.fields);
        next();
	}
};