import express from "express";
import { wrapException } from "./common.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TesteResposta:
 *       type: object 
 *       required:
 *         - message
 *         - body
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de status da rota
 *         body:
 *           type: object
 *           description: Resposta
 *       example:
 *         message: Recebido
 *         body:
 *           teste: Teste
 */

/**
 * @swagger
 * tags:
 *   name: Teste
 *   description: Rota que apenas testa o funcionamento das respostas
 */

/**
 * @swagger
 * /teste:
 *   get:
 *     summary: Apenas para testar
 *     tags: [Teste]
 *     parameters:
 *     - in: query
 *       name: teste
 *       required: false
 *       schema:
 *         type: string
 *         example: "Teste de mensagem"
 *       description: Envie uma mensagem para testar
 *     responses:
 *       200:
 *         description: Retorna a query que foi enviada no GET request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TesteResposta'
 */

router.get("/teste", wrapException((req,res) => {
	res.status(200).json({ 
		message: "Recebido",
		body: req.query 
	});
}));

export default router;