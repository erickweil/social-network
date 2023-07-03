import express from "express";
import { wrapException } from "./testeRoutes.js";
import SeguidorControler from "../controllers/SeguidorController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Seguidor
 *   description: Rota para seguir, deixar de seguir, listar os seguidores e seguindo.
 */

/**
 * @swagger
 * /usuarios/{id}/seguir:
 *   post:
 *     summary: Seguir um usuário
 *     tags: [Seguidor]
 *     security:
 *       - bearerAuth: []
 *     description: Permite que um usuário siga outro usuário na rede social.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário que será seguido
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *   delete:
 *     summary: Deixar de seguir um usuário
 *     tags: [Seguidor]
 *     security:
 *       - bearerAuth: []
 *     description: Permite que um usuário deixe de seguir outro usuário na rede social.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário que deixará de ser seguido
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
/** 
 * @swagger
 * /usuarios/{id}/seguidores:
 *   get:
 *     summary: Listar seguidores de um usuário
 *     tags: [Seguidor]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna a lista de usuários que seguem o usuário especificado.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
/** 
 * @swagger
 * /usuarios/{id}/seguindo:
 *   get:
 *     summary: Listar usuários seguidos por um usuário
 *     tags: [Seguidor]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna a lista de usuários que o usuário especificado está seguindo.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
*/

router.post("/usuarios/:id/seguir", AuthMiddleware, wrapException(SeguidorControler.seguirUsuario));
router.delete("/usuarios/:id/seguir", AuthMiddleware, wrapException(SeguidorControler.deixarSeguirUsuario));

router.get("/usuarios/:id/seguidores", AuthMiddleware, wrapException(SeguidorControler.listarSeguidores));
router.get("/usuarios/:id/seguindo", AuthMiddleware, wrapException(SeguidorControler.listarSeguindo));

export default router;