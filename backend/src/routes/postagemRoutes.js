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
 *        _id:
 *          type: string
 *          description: ID da postagem
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
 *        created_at:
 *          type: string
 *          format: date-time
 *          description: Data e hora de criação da postagem
 *    PostagemComResposta:
 *      allOf:
 *      - $ref: '#/components/schemas/Postagem'
 *      - type: object
 *        properties:
 *          respostas:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Postagem'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ListagemPostagem:
 *       type: object
 *       properties:
 *         resposta:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Postagem'
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
 * components:
 *   schemas:
 *     ListagemResposta:
 *       type: object
 *       properties:
 *         resposta:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostagemComResposta'
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
 * /postagens:
 *   get:
 *     summary: Listar postagens recomendadas (For You)
 *     description: |
 *       É possível pesquisar pelo conteúdo dos posts especificando o parâmetro **pesquisa**, e pesquisar por hashtag via
 *       o parâmetro **hashtag**
 * 
 *       Detalhes sobre como a pesquisa por texto funciona:
 *       [https://github.com/erickweil/social-network#pesquisa-por-texto](https://github.com/erickweil/social-network#pesquisa-por-texto)
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
 *               $ref: '#/components/schemas/ListagemPostagem'
 *   post:
 *     summary: Criar uma nova postagem
 *     description: |
 *       Realiza uma postagem com texto e/ou até 8 imagens. Caso especifique postagemPai irá ser uma resposta a esta postagem 
 * 
 *       Deve enviar os campos **conteudo** e **postagemPai** como **multipart/form-data**
 * 
 *       As imagens deve ser enviadas no campo **fotos_post** do formulário na mesma requisição
 *     
 *       Detalhes sobre como upload de imagens funciona:
 *       [https://github.com/erickweil/social-network#upload-de-imagens](https://github.com/erickweil/social-network#upload-de-imagens)
 *     
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
 *     description: |
 *       Esta rota deleta uma postagem que você fez (Não é possível deletar postagens de outros usuários).
 * 
 *       Detalhes sobre o quê é deletado:
 *       [https://github.com/erickweil/social-network#deletar-elementos](https://github.com/erickweil/social-network#deletar-elementos)
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
 *     summary: Listar Respostas de uma postagem.
 *     description: |
 *       Lista as respostas de uma postagem, bem como as respostas delas. Basicamente irá pesquisar até 16 posts
 *       que são respostas diretas ao post com **id** especificado, e cada resultado terá expandido até 5 respostas diretas
 * 
 *       É possível pesquisar pelo conteúdo dos posts especificando o parâmetro **pesquisa**, e pesquisar por hashtag via
 *       o parâmetro **hashtag** (A filtragem se aplica apenas às respostas imediatas, não às respostas das respostas que são expandidas)
 * 
 *       Detalhes sobre como a pesquisa por texto funciona:
 *       [https://github.com/erickweil/social-network#pesquisa-por-texto](https://github.com/erickweil/social-network#pesquisa-por-texto)
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
 *               $ref: '#/components/schemas/ListagemResposta'
 *       404:
 *         description: Postagem não encontrada
 */

/**
 * @swagger
 * /usuarios/{id}/postagens:
 *   get:
 *     summary: Listar postagens de um usuário
 *     description: |
 *       São listadas todas as postagens de um usuário especificado pelo **id**. Não são listadas respostas à outras postagens,
 *       para isso veja a rota ** /usuarios/id/respostas**
 *       
 *       É possível pesquisar pelo conteúdo dos posts especificando o parâmetro **pesquisa**, e pesquisar por hashtag via
 *       o parâmetro **hashtag**
 * 
 *       Detalhes sobre como a pesquisa por texto funciona:
 *       [https://github.com/erickweil/social-network#pesquisa-por-texto](https://github.com/erickweil/social-network#pesquisa-por-texto)
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
 *               $ref: '#/components/schemas/ListagemPostagem'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}/respostas:
 *   get:
 *     summary: Listar respostas de um usuário
 *     description: |
 *       São listadas todas as respostas à postagens feitas por um usuário especificado pelo **id**. Não são listadas postagens que não são respostas à outra postagem,
 *       para isso veja a rota ** /usuarios/id/postagens**
 *       
 *       É possível pesquisar pelo conteúdo dos posts especificando o parâmetro **pesquisa**, e pesquisar por hashtag via
 *       o parâmetro **hashtag**
 * 
 *       Detalhes sobre como a pesquisa por texto funciona:
 *       [https://github.com/erickweil/social-network#pesquisa-por-texto](https://github.com/erickweil/social-network#pesquisa-por-texto)
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
 *               $ref: '#/components/schemas/ListagemPostagem'
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