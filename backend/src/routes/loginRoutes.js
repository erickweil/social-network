import express from "express";
import LoginControler from "../controllers/LoginController.js";
import { wrapException } from "./common.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RespostaLogin:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTYzMjIwOTg4NWQ4ZTgzNzhlZTU5MCIsIm5vbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2ODg3NzQwMjMsImV4cCI6MTY4ODc4MTIyM30.iZvQN6NiGQ9GE1W2UpdUTv5YbDHH8ULsOyLtEockkqc
 *         usuario:
 *           $ref: '#/components/schemas/Usuario' 
 */

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
 *               $ref: '#/components/schemas/RespostaLogin'     
 */    

router.post("/login", wrapException(LoginControler.fazerLogin));

export default router;