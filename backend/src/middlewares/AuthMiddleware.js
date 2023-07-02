import jwt from "jsonwebtoken";
import { promisify } from "util";
import usuarios, { usuarioTeste } from "../models/Usuario.js";

const AuthMiddleware = async (req, res, next) => {
  // Caso a variável de ambiente esteja definida
  // A autenticação é desativada.
  if(process.env.DISABLE_AUTH === "true") {
    const usuario = await usuarios.findOne({email: usuarioTeste.email});
    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };
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

      // A FAZER: não deve aceitar o token se:
      // Usuário trocou a senha
      // Usuário foi deletado
      // Usuário fez logout

      req.usuario = {
        id: decoded.id,
        nome: decoded.nome,
        email: decoded.email
      };
      next();
      return;
    }

  } catch { // se o token não for válido
    return res.status(498).json([{ error: true, message: "O token de autenticação não é válido" }]);
  }
};

export default AuthMiddleware;
