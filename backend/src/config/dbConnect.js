import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega variáveis de ambiente
dotenv.config();

const bancoUrl = process.env.DB_URL;
async function conectarBanco() {

	if(mongoose.connection.readyState === 1) return; // já está conectado

	try {
		mongoose.set("strictQuery", true);

		if(process.env.DEBUGLOG === "true")
		console.log("Tentando conexão com banco em " + bancoUrl + " ...");

		mongoose.connection
			.on("open", () => {
				if(process.env.DEBUGLOG === "true") console.log("Conexão com banco em " + bancoUrl + " estabelecida com sucesso!");
			})
			.on("error", err => {
				console.log("Erro no banco de dados:",err);
			})
			.on("disconnected", () => {
				if(process.env.DEBUGLOG === "true") console.log("Desconectou do banco de dados.");
			});

		await mongoose.connect(bancoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		
	} catch (error) {
		console.log("Erro ao conectar com banco em " + bancoUrl + ": " + error);
		throw error; // não iniciar o servidor se não conseguir se conectar com o banco
	}
}

await conectarBanco();

export async function desconetarBanco() {
	if(process.env.DEBUGLOG === "true")	console.log("Solicitando encerramento da conexão com banco");

	await mongoose.connection.close();
}

async function callbackSigTerm() {
	try {
		await desconetarBanco();
	} finally {
		process.exit(); // como está interceptando o SIGINT e SIGTERM se não chamar exit o processo não é terminado.
	}
}
  
// If the Node process ends, close the Mongoose connection
process.on("SIGINT", callbackSigTerm).on("SIGTERM", callbackSigTerm);

export default mongoose.connection;