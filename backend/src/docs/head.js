const getSwaggerOptions = () => {
	return {
		swaggerDefinition: {
			openapi: "3.0.0",
			info: {
				title: "Rede Social API",
				version: "1.0-pre3",
				description: "API para utilizar a rede social.\n\nÉ necessário autenticar com token JWT antes de utilizar a maioria das rotas, faça isso na rota /login com um email e senha válido\n\nMais informações em [https://github.com/erickweil/social-network](https://github.com/erickweil/social-network)",
				contact: {
					name: "Erick Leonardo Weil",
					email: "erick.weil@ifro.edu.br",
				},
			},
			servers: [
				{
					url: "https://erick.fslab.dev/absproxy/3000",
				},
				{
					url: "https://erick.fslab.dev/proxy/3000",
				},
				{
					url: "http://127.0.0.1:"+process.env.PORT,
				}			
			],
			components: {
				securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				}
				}
			}	
		},
		paths: {},
		apis: ["./src/routes/*.js"]
	};
};

export default getSwaggerOptions;