import express from "express";
import UsuarioControler from "../controllers/UsuarioController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { upload, wrapException } from "./common.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário (Apenas se o usuário permitir exibir)
 *         fotoPerfil:
 *           type: string
 *           description: Foto de perfil do usuário
 *         biografia:
 *           type: string
 *           description: Biografia do usuário
 *       example:
 *         id: "551137c2f9e1fac808a5f572"
 *         nome: "João"
 *         email: "joao@email.com"
 *         fotoPerfil: "/img/usuario-default.png"
 *         biografia: "Oi eu sou o João"
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Rotas de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     parameters:
 *       - name: nome
 *         in: query
 *         description: Procura por usuário com o nome que inicia com o valor informado
 *         required: false
 *         default: 
 *         schema:
 *           type: string
 *       - name: pagina
 *         in: query
 *         description: Pagina
 *         required: false
 *         default:
 *         schema:
 *           type: integer
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             items:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *                 example: "Usuário Teste"  
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: "teste@teste.com.br"  
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "ABCDabcd1234"  
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno
 *   patch:
 *     summary: Atualiza o seu usuário
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno
 *   delete:
 *     summary: Deleta o seu usuário
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senha
 *             properties:
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "ABCDabcd1234"   
 *     responses:
 *       200:
 *         description: Deletado com sucesso
 *       500:
 *         description: Erro interno
 */ 

/**
 * @swagger
 * /usuarios/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       schema: 
 *         type: string
 *       required: true
 *   get:
 *     summary: Retorna um usuário
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resposta usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno      
 */

router.get("/usuarios", AuthMiddleware, wrapException(UsuarioControler.listarUsuarios));
router.get("/usuarios/:id", AuthMiddleware, wrapException(UsuarioControler.listarUsuarioPorId));

// Operações no próprio usuário autenticado
router.patch("/usuarios", AuthMiddleware, wrapException(UsuarioControler.atualizarUsuario));
router.delete("/usuarios", AuthMiddleware, wrapException(UsuarioControler.deletarUsuario));
router.post("/usuarios/foto-perfil", AuthMiddleware, wrapException(upload.single("foto_perfil")), wrapException(UsuarioControler.atualizarFotoPerfil));
router.post("/usuarios/foto-capa", AuthMiddleware, wrapException(upload.single("foto_capa")), wrapException(UsuarioControler.atualizarFotoCapa));

// Cadastro de usuário não exige autenticação
router.post("/usuarios", wrapException(UsuarioControler.cadastrarUsuario));


export default router;