import express from "express";
import LoginControler from "../controllers/LoginController.js";
import { wrapException } from "./testeRoutes.js";

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: "joao@email.com"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "ABCDabcd1234"
 *     responses:
 *       200:
 *         description: Autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'     
 */    

router.post("/login", wrapException(LoginControler.fazerLogin));

export default router;