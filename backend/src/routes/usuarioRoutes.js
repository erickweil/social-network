import express from "express";
import UsuarioControler from "../controllers/UsuarioController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { wrapException } from "./common.js";
import { upload } from "../utils/foto.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         fotoPerfil:
 *           type: string
 *           description: Foto de perfil do usuário
 *         fotoCapa:
 *           type: string
 *           description: Foto de capa do usuário
 *         biografia:
 *           type: string
 *           description: Biografia do usuário
 *         created_at:
 *           type: string
 *           description: Data que foi criado
 *         updated_at:
 *           type: string
 *           description: Data que foi atualizado
 *       example:
 *         _id: "64a632209885d8e8378ee590"
 *         nome: "João da Silva"
 *         email: "joao@email.com"
 *         fotoPerfil: "/img/64a632209885d8e8378ee590/b63a5067-961c-47f2-9756-1c3211a8ce8a.jpg"
 *         fotoCapa: "/img/64a632209885d8e8378ee590/1dd9c3d2-1843-40b3-8e65-c003a341959a.jpg"
 *         biografia: "Oi eu sou o João"
 *         created_at: "2023-07-06T03:16:48.722Z"
 *         updated_at: "2023-07-07T18:51:04.015Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ListagemUsuario:
 *       type: object
 *       properties:
 *         resposta:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Usuario'
 *         pagina:
 *           type: integer
 *           description: Página atual da pesquisa
 *           example: 1
 *         limite:
 *           type: integer
 *           description: Número máximo de elementos a serem exibidos na listagem
 *           example: 16
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
 *     summary: Retorna uma lista de usuários baseado na pesquisa. 
 *     description: |
 *       Retorna a lista de usuários, permitindo pesquisar por termos específicos no nome. 
 *       **Obs:** não tem como pesquisar sem especificar uma pesquisa
 * 
 *       Detalhes sobre como a pesquisa por texto funciona:
 *       [https://github.com/erickweil/social-network#pesquisa-por-texto](https://github.com/erickweil/social-network#pesquisa-por-texto)
 *     parameters:
 *       - name: nome
 *         in: query
 *         description: Procura por usuário com nome que atende aos termos pesquisados
 *         required: true
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
 *               $ref: '#/components/schemas/ListagemUsuario'
 *       500:
 *         description: Erro interno
 *   post:
 *     summary: Cria um novo usuário
 *     description: |
 *       Deve informar o **nome**, **email** e **senha** do usuário a ser criado
 * 
 *       Detalhes sobre como a força da senha é calculada:
 *       [https://github.com/erickweil/social-network#criar-conta](https://github.com/erickweil/social-network#criar-conta)
 *     tags: [Usuarios]
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
 *     description: |
 *       Esta rota permite atualizar os campos de seu **próprio usuário**:
 *       - nome
 *       - biografia
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *                 example: "Outro Nome"  
 *               biografia:
 *                 type: string
 *                 description: Biografia
 *                 example: "Oi eu sou o João"
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
 *     description: |
 *       Esta rota deleta o **seu próprio usuário**.
 * 
 *       Veja que é necessário enviar sua senha como confirmação
 * 
 *       Detalhes sobre o quê é deletado:
 *       [https://github.com/erickweil/social-network#deletar-elementos](https://github.com/erickweil/social-network#deletar-elementos)
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

/**
 * @swagger
 * /usuarios/foto-perfil:
 *   post:
 *     summary: Atualiza a foto de perfil
 *     description: |
 *       Para enviar a imagem deve ela deve ser enviada por meio de formulário multipart/form-data
 *       com o nome **foto_perfil**
 *       
 *       Detalhes sobre como upload de imagens funciona:
 *       [https://github.com/erickweil/social-network#upload-de-imagens](https://github.com/erickweil/social-network#upload-de-imagens)
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto_perfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem de perfil atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /usuarios/foto-capa:
 *   post:
 *     summary: Atualiza a foto de capa
 *     description: |
 *       Esta rota atualiza a foto de capa do **seu próprio usuário**.
 *       O a imagem deve ser enviada por meio de formulário multipart/form-data com o nome **foto_capa**
 *       
 *       Detalhes sobre como upload de imagens funciona:
 *       [https://github.com/erickweil/social-network#upload-de-imagens](https://github.com/erickweil/social-network#upload-de-imagens)
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto_capa:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem de capa atualizada com sucesso
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