import express from "express";
import cors from "cors";
// TEM QUE SER O PRIMEIRO IMPORT PARA FAZER O DOTENV FUNCIONAR
import db from "./config/dbConnect.js";

import routes from "./routes/index.js";

const app = express();

// Problema no Proxy do Code Server... Precisa decodificar 2 vezes
//app.set("query parser", (queryString) => {
//    //return new URLSearchParams(queryString);
//    console.log(queryString);
//    return queryparser.decode(queryString);
//});

// habilitando o uso de json pelo express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Habilita o CORS para todas as origens
app.use(cors());

let appRouter = app;

// Permitir hospedar api em caminho além de /
if(process.env.SUBPATH && process.env.SUBPATH != "/") {
    const router = express.Router();
    app.use(process.env.SUBPATH, router);
    appRouter = router;

    if(process.env.DEBUGLOG === "true") {
        console.log("esperando no subcaminho %s",process.env.SUBPATH);
    }
}

if (process.env.NODE_ENV === "development") {
    appRouter.use(express.static("public"));
}

// Passando para o arquivo de rotas o app, que envia junto uma instância do express
routes(appRouter);

export default app;
