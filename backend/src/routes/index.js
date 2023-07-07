import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import getSwaggerOptions from "../docs/head.js";

import teste from "./testeRoutes.js";
import usuario from "./usuarioRoutes.js";
import login from "./loginRoutes.js";
import seguidor from "./seguidorRoutes.js";
import img from "./imgRoutes.js";
import postagem from "./postagemRoutes.js";

export const logRoutes = (req,res,next) => {
	const timestamp = new Date().toISOString();

	let ip = req.headers["x-forwarded-for"] ||
	req.socket.remoteAddress ||
	null;

	console.log(timestamp+" "+ip+" "+req.protocol + "://" + req.get("host") + req.originalUrl);
	// TEMP Log Headers
	//console.log(JSON.stringify(req.headers));
	next();
};

const routes = (app) => {

	if(process.env.DEBUGLOG === "true") {
	app.use(logRoutes);
	}

	app.get("/",(req, res) => {
		res.status(200).redirect("docs"); // redirecionando para documentação
	});

	app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(getSwaggerOptions())));

	app.use(
		teste,
		usuario,
		login,
		seguidor,
		img,
		postagem
	);

	app.use((req,res,next) => {
		res.sendStatus(404);
	});
};

export default routes;
