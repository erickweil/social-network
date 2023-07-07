import express from "express";
import { wrapException } from "./common.js";
import { getImagem } from "../utils/foto.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Imagens
 *   description: Rotas que lidam com imagens
 */

/**
 * @swagger
 * /img/{id}/{img}:
 *   parameters:
 *     - name: id
 *       in: path
 *       schema: 
 *         type: string
 *       required: true
 *     - name: img
 *       in: path
 *       schema: 
 *         type: string
 *       required: true
 *   get:
 *     summary: Acessar imagem de perfil, capa ou postagem. Sempre é um .jpg
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respondeu com a imagem
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/img/:id/:img", AuthMiddleware, wrapException(getImagem));

export default router;