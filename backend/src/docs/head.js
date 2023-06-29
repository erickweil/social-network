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
					url: "http://127.0.0.1:3000",
				},
				{
					url: "http://localhost:3000",
				}
			],
		},
		paths: {},
		apis: ["./src/routes/*.js"],
	};
};

export default getSwaggerOptions;