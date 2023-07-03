import multer from "multer";
import crypto from "crypto";
import { mkdir } from "fs";

const acceptableFormats = {
    "image/bmp":    ".bmp",
    "image/gif":    ".gif",
    "image/jpeg":	".jpg",
    "image/png":    ".png",
    "image/webp":   ".webp"
};

function fileFilter(req, file, cb) {
    if(!req.usuario || !req.usuario.id) {
        return cb("É necessário estar autenticado");
    }

    if(!acceptableFormats[file.mimetype]) {
        return cb("Imagens só podem ser nos formatos: bmp, gif, jpg, png, webp");
    }
    return cb(null, true);
}

function getFilename (req, file, cb) {
    crypto.randomBytes(8, function (err, raw) {
        cb(err, err ? undefined : raw.toString("hex")+acceptableFormats[file.mimetype]);
    });
}
  
function getDestination (req, file, cb) {
    const dir = "public/img/"+req.usuario.id;

    mkdir(dir,{recursive: true},(err,path) => {        
        cb(null, err ? undefined : dir);
    });
}

export const upload = multer({
    fileFilter: fileFilter,
    storage: multer.diskStorage({
    destination: getDestination,
    filename: getFilename
})});

export const wrapException = (fn) => {
	return async (req,res,next) => {
		try {
			await fn(req,res,next);
		} catch (err) {	
			console.log(err.stack || err);
			res.status(500).send("Erro interno inesperado.");
		}
	};
};