import express from "express";
import { wrapException } from "./common.js";
import CurtidaController from "../controllers/CurtidaController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * /postagens/{id}/curtidas:
 *   post:
 *     summary: Curtir uma postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     description: Permite curtir uma postagem
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da postagem que será curtida
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Postagem não encontrada
 *   delete:
 *     summary: Des-curtir uma postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     description: Permite remover uma curtida de uma postagem
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da postagem que será des-curtida
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Postagem não encontrada
 */

/**
 * @swagger

/**
 * @swagger
 * /usuarios/curtidas:
 *   get:
 *     summary: Listar postagens curtidas por você
 *     parameters:
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
 *         description: Retorna a lista de postagens curtidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Postagem'
 */

// Curtir postagem
router.post("/postagens/:id/curtidas", AuthMiddleware, wrapException(CurtidaController.curtirPostagem));

// Des-curtir postagem
router.delete("/postagens/:id/curtidas", AuthMiddleware, wrapException(CurtidaController.descurtirPostagem));

// Só pode obter postagens que você mesmo curtiu
router.get("/usuarios/curtidas", AuthMiddleware, wrapException(CurtidaController.listarPostagensCurtidas));

export default router;