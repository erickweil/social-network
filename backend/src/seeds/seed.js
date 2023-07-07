import db from "../config/dbConnect.js";
import usuariosSeed from "./usuariosSeed.js";

await usuariosSeed(1000);

db.close();