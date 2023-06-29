const getSwaggerOptions = () => {
	return {
		swaggerDefinition: {
			openapi: "3.0.0",
			info: {
				title: "Rede Social API",
				version: "1.0.0",
				description: "API para utilizar a rede social.",
				contact: {
					name: "Erick Leonardo Weil",
					email: "erick.weil@ifro.edu.br",
				},
			},
			servers: [
				{
					url: "https://erick.fslab.dev/proxy/3000",
				},
				{
					url: "http://127.0.0.1:3000",
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