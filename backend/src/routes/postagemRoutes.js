import express from "express";
import { wrapException } from "./common.js";
import PostagemController from "../controllers/PostagemController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { upload } from "../utils/foto.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Postagens
 *   description: Rotas que lidam com postagens
 */

/**
 * @swagger
 *components:
 *  schemas:
 *    Postagem:
 *      type: object
 *      properties:
 *        usuario:
 *          $ref: '#/components/schemas/Usuario'
 *        conteudo:
 *          type: string
 *          description: Conteúdo da postagem
 *        hashtags:
 *          type: array
 *          items:
 *            type: string
 *          description: Lista de hashtags relacionadas à postagem
 *        imagens:
 *          type: array
 *          items:
 *            type: string
 *          description: Lista de URLs das imagens associadas à postagem
 *        numCurtidas:
 *          type: integer
 *          description: Número de curtidas recebidas pela postagem
 *        numRespostas:
 *          type: integer
 *          description: Número de respostas recebidas pela postagem
 *        nivel:
 *          type: integer
 *          description: Nível da postagem
 *        _id:
 *          type: string
 *          description: ID da postagem
 *        created_at:
 *          type: string
 *          format: date-time
 *          description: Data e hora de criação da postagem
 *        __v:
 *          type: integer
 *          description: Algo a ver com o mongoose, ignore este campo
 */

/**
 * @swagger
 * /postagens:
 *   get:
 *     summary: Listar postagens recomendadas (For You)
 *     parameters:
 *       - name: pesquisa
 *         in: query
 *         description: Procura por postagens contendo os termos pesquisados
 *         required: false
 *         default: 
 *         schema:
 *           type: string
 *       - name: hashtag
 *         in: query
 *         description: Procura por postagens contendo a hashtag informada
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
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna a lista de postagens recomendadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Postagem'
 *   post:
 *     summary: Criar uma nova postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 description: Conteúdo da postagem
 *                 example: "Teste de Postagem"
 *               postagemPai:
 *                 type: string
 *                 description: Id da postagem pai
 *                 example: ""
 *               fotos_post:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Realizou a postagem
 */

/**
 * @swagger
 * /postagens/{id}:
 *   get:
 *     summary: Obter uma postagem por ID
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da postagem a ser obtida
 *     responses:
 *       200:
 *         description: Postagem encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Postagem'
 *       404:
 *         description: Postagem não encontrada
 *   delete:
 *     summary: Deletar uma postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da postagem a ser deletada
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Postagem deletada com sucesso
 *       401:
 *         description: Não autorizado - usuário não tem permissão para deletar a postagem
 *       404:
 *         description: Postagem não encontrada
 */

/**
 * @swagger
 * /postagens/{id}/respostas:
 *   get:
 *     summary: Listar Postagem, suas respostas e a postagem pai
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *       - name: pesquisa
 *         in: query
 *         description: Procura por postagens contendo os termos pesquisados
 *         required: false
 *         default: 
 *         schema:
 *           type: string
 *       - name: hashtag
 *         in: query
 *         description: Procura por postagens contendo a hashtag informada
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
 *     responses:
 *       200:
 *         description: Lista de respostas à postagem
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *                 postagemPai:
 *                   $ref: '#/components/schemas/Postagem'
 *                 conteudo:
 *                   type: string
 *                   description: Conteúdo da postagem
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de hashtags relacionadas à postagem
 *                 imagens:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de URLs das imagens associadas à postagem
 *                 numCurtidas:
 *                   type: integer
 *                   description: Número de curtidas recebidas pela postagem
 *                 numRespostas:
 *                   type: integer
 *                   description: Número de respostas recebidas pela postagem
 *                 nivel:
 *                   type: integer
 *                   description: Nível da postagem
 *                 respostas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Postagem'
 *                 _id:
 *                   type: string
 *                   description: ID da postagem
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora de criação da postagem
 *                 __v:
 *                   type: integer
 *                   description: Algo a ver com o mongoose, ignore este campo
 *       404:
 *         description: Postagem não encontrada
 */

/**
 * @swagger
 * /usuarios/{id}/postagens:
 *   get:
 *     summary: Listar postagens de um usuário
 *     tags: [Postagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *       - name: pesquisa
 *         in: query
 *         description: Procura por postagens contendo os termos pesquisados
 *         required: false
 *         default: 
 *         schema:
 *           type: string
 *       - name: hashtag
 *         in: query
 *         description: Procura por postagens contendo a hashtag informada
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de postagens do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Postagem'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}/respostas:
 *   get:
 *     summary: Listar respostas de um usuário
 *     tags: [Postagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *       - name: pesquisa
 *         in: query
 *         description: Procura por respostas contendo os termos pesquisados
 *         required: false
 *         default: 
 *         schema:
 *           type: string
 *       - name: hashtag
 *         in: query
 *         description: Procura por respostas contendo a hashtag informada
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de postagens do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Postagem'
 *       404:
 *         description: Usuário não encontrado
 */

// Listar as postagens recomendadas (For You)
router.get("/postagens", AuthMiddleware, wrapException(PostagemController.listarPostagens));

// Listar uma única postagem
router.get("/postagens/:id", AuthMiddleware, wrapException(PostagemController.listarPostagemPorId));

// Listar respostas de uma postagem, e as algumas respostas delas
router.get("/postagens/:id/respostas", AuthMiddleware, wrapException(PostagemController.listarRespostas));

// Listar postagens de um usuário
router.get("/usuarios/:id/postagens", AuthMiddleware, wrapException(PostagemController.listarPostagensUsuario));

// Listar respostas que um usuário fez à postagens
router.get("/usuarios/:id/respostas", AuthMiddleware, wrapException(PostagemController.listarRespostasUsuario));

// Criar uma postagem
router.post("/postagens", AuthMiddleware,wrapException(upload.multiple("fotos_post")), wrapException(PostagemController.realizarPostagem));

// Deletar uma postagem (só quem fez a postagem tem permissão para isso)
router.delete("/postagens/:id", AuthMiddleware, wrapException(PostagemController.deletarPostagem));


export default router;