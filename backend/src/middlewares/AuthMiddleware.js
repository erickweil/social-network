import jwt from "jsonwebtoken";
import { promisify } from "util";
import Usuario, { usuarioTeste } from "../models/Usuario.js";

const AuthMiddleware = async (req, res, next) => {

  try {
    // Caso a variável de ambiente esteja definida
    // A autenticação é desativada.
    if(process.env.DISABLE_AUTH === "true") {
      const usuario = await Usuario.findOne({email: usuarioTeste.email});
      
      req.usuario = usuario;
      next();
      return;
    }

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

      // Eu sei que fazer essa pesquisa no banco invalida toda as vantagens do JWT
      // Mas agora me explica como invalidar todos os tokens de um usuário se:
      // - Usuário trocou a senha
      // - Usuário foi deletado
      // Mudar o secret não resolve - Requerimento é invalidar todos os tokens de um usuário, e não de todos os usuários
      // Refresh Token não resolve - Além disso esse invalidamento deve acontecer imediatamente, e não daqui 15 minutos ou algo assim
      // Blacklist em memória de Tokens não resolve - Torna a aplicação Statefull e impede multiplas instâncias do server rodando
      // Blacklist no banco é equivalente a pesquisar o usuário
      // Se utilizar o redis para verificar os tokens então vamos utilizar sessão logo.
      const usuario = await Usuario.findById(decoded.id);

      if(!usuario) 
      return res.status(498).json([{ error: true, message: "O token de autenticação foi invalidado pelo servidor" }]);

      req.usuario = usuario;
      next();
      return;
    }

  } catch { // se o token não for válido
    return res.status(498).json([{ error: true, message: "O token de autenticação não é válido" }]);
  }
};

export default AuthMiddleware;
