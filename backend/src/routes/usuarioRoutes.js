import express from "express";
import UsuarioControler from "../controllers/UsuarioController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         senha:
 *           type: string
 *           description: Senha do usuário
 *         fotoPerfil:
 *           type: string
 *           description: Foto de perfil do usuário
 *         biografia:
 *           type: string
 *           description: Biografia do usuário
 *         created_at:
 *           type: string
 *           description: Data de criação do usuário
 *         updated_at:
 *           type: string
 *           description: Data de atualização do usuário
 *       example:
 *         nome: "João"
 *         email: "joao@email.com"
 *         senha: "12345678"
 *         biografia: Olá, eu sou o João
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                 type: boolean
 *                 description: Ocorreu um erro
 *               example:
 *                 error: true
 *                 message: Erro interno
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
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'       
 */    

router.get("/usuarios", AuthMiddleware, UsuarioControler.listarUsuarios);
router.get("/usuarios/:id", AuthMiddleware, UsuarioControler.listarUsuarioPorId);
router.post("/usuarios", AuthMiddleware, UsuarioControler.cadastrarUsuario);


export default router;