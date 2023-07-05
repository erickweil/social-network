import db from "../config/dbConnect.js";
import usuariosSeed from "./usuariosSeed.js";

await usuariosSeed(32);

db.close();