import express from "express";
import { wrapException } from "./common.js";
import { getImagem } from "../utils/foto.js";

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
 *     summary: Acessar imagem
 *     description: |
 *       Permite obter as imagens, que podem ser a imagem de perfil, capa ou de uma postagem.
 *       Sempre é um .jpg
 *     tags: [Imagens]
 *     responses:
 *       200:
 *         description: Respondeu com a imagem
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/img/:id/:img", wrapException(getImagem));

export default router;