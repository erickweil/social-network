import jwt from "jsonwebtoken";
import { promisify } from "util";

const AuthMiddleware = async (req, res, next) => {
  // Caso a variável de ambiente esteja definida
  // A autenticação é desativada.
  if(process.env.DISABLE_AUTH === "true") {
    next();
    return;
  }

  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(498).json([{ error: true, message: "É necessário se autenticar" }]);
    }

    const [, token] = auth.split(" "); // desestruturação

    // promisify converte uma função de callback para uma função async/await
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
    if (!decoded) { // se não ocorrer a decodificação do token
      return res.status(498).json([{ error: true, message: "O token de autenticação expirou" }]);
    } else { // se o token for válido
      req.user_id = decoded.id;
      next();
      return;
    }

  } catch { // se o token não for válido
    return res.status(498).json([{ error: true, message: "O token de autenticação não é válido" }]);
  }
};

export default AuthMiddleware;
