import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import getSwaggerOptions from "../docs/head.js";

import teste from "./testeRoutes.js";

export const logRoutes = (req,res,next) => {
	const timestamp = new Date().toISOString();

	let ip = req.headers["x-forwarded-for"] ||
	req.socket.remoteAddress ||
	null;

	console.log(timestamp+" "+ip+" "+req.protocol + "://" + req.get("host") + req.originalUrl);
	next();
};

const routes = (app) => {

	//if(LOG_ROUTES) {
	app.use(logRoutes);
	//}

	app.get("/",(req, res) => {
		res.status(200).redirect("/docs"); // redirecionando para documentação
	});

	app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(getSwaggerOptions())));

	app.use(
		teste
	);
};

export default routes;
