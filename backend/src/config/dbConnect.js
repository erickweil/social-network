import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega variáveis de ambiente
dotenv.config();

async function conectarBanco() {

	const bancoUrl = process.env.DB_URL;
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
				console.log("Desconectou do banco de dados.");
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

export default mongoose.connection;