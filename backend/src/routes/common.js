export const wrapException = (fn) => {
	return async (req,res,next) => {
		try {
			await fn(req,res,next);
		} catch (err) {	
			console.log(err.stack || err);
			res.status(500).send("Erro interno inesperado.");
		}
	};
};