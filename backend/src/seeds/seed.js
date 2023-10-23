import db from "../config/dbConnect.js";
import postagemSeed from "./postagemSeed.js";
import seguidorSeed from "./seguidorSeed.js";
import usuariosSeed from "./usuariosSeed.js";

let idUsuarios = await usuariosSeed(100);
await seguidorSeed(idUsuarios,10);
await postagemSeed(idUsuarios,10);

db.close();