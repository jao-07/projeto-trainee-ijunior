/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/userService";
import {login, notLoggedIn, verifyJWT, checkRole, logout} from "../../../middlewares/auth";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { User } from "@prisma/client";
import statusCodes from "../../../../utils/constants/statusCodes";
import { userRoles } from "../../../../utils/constants/userRoles";

const router = Router();
const userService = new UserService;

//Criar conta (usuário normal)
router.post("/create", async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Campos do usuário vazios");

		data.privileges = userRoles.USER;
		const user = await userService.create(data);
		res.json(user).status(statusCodes.SUCCESS);
	}
	catch (error: any){
		res.status(statusCodes.BAD_REQUEST).json({
			error: error.name,
			message: error.message
		});
	}
});

//Login
router.post("/login", notLoggedIn, login);

//Logout
router.post("/logout", verifyJWT, logout);

//Visualizar minha conta
router.get("/account", verifyJWT, async (req: Request, res: Response) => {
	try{
		const user = req.user;
		const userData = await userService.getUserByID(user.id as number);
		res.json(userData).status(statusCodes.SUCCESS);
	}
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Editar minha conta
router.put("/account/update", verifyJWT, async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Parâmetros de update vazios");

		const user = req.user;
		const updateData: Partial<User> = {
			name: data.name !== undefined ? data.name : user.name,
			email: data.email !== undefined ? data.email : user.email,
			photo: data.photo !== undefined ? data.photo : user.photo,
			password: data.password !== undefined ? data.password : user.password,
		};

		const updatedUser = await userService.update(user.id as number, updateData);
		res.json(updatedUser).status(statusCodes.SUCCESS);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Alterar minha senha
router.put("/account/password", verifyJWT, async (req: Request, res: Response) => {
	try{
		const user = req.user;
		const password = req.body.password;
		if(!password)
			throw new InvalidParamError("Senha inválida");
		const updatedUser = await userService.update(user.id as number, {password: password});
		res.json(updatedUser).status(statusCodes.SUCCESS);
	}
	catch(error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Excluir minha conta
router.delete("/account/delete", verifyJWT, async (req: Request, res: Response) => {
	try{
		const user = req.user;
		const deletedUser = await userService.deleteByID(user.id as number);
		res.json(deletedUser).status(statusCodes.SUCCESS).clearCookie("jwt");
	}
	catch(error: any){
		res.status(statusCodes.FORBIDDEN).json({
			error: error.name,
			message: error.message
		});
	}
});

//Ouvir música
router.post("/account/listen/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = req.user;
		const addedMusic = await userService.addMusicToUser(Number(req.params.id), user.id as number);
		res.status(statusCodes.SUCCESS).json(addedMusic);
	}
	catch (error){
		next(error);
	}
});

//Remover música ouvida
router.delete("/account/unlisten/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = req.user;
		const updatedUser = await userService.removeMusicFromUser(Number(req.params.id), user.id as number);
		res.json(updatedUser);
	}
	catch (error){
		next(error);
	}
});

//Listar músicas ouvidas
router.get("/account/musics", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const musics = await userService.getMusics(Number(req.params.id));
		res.json(musics);
	}
	catch (error) {
		next(error);
	}
});

//Listar usuários (ordem alfabética)
router.get("/", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const users = await userService.getUsers();
		res.json(users);
	}
	catch (error) {
		next(error);
	}
});

//Visualizar usuário específico
router.get("/:id", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.getUserByID(Number(req.params.id));
		res.json(user);
	}
	catch (error) {
		next(error);
	}
});

//Criar usuário (admin ou não)
router.post("/admin/create", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Campos do usuário vazios");

		const user = await userService.create(data);
		res.json(user).status(statusCodes.SUCCESS);
	}
	catch (error: any){
		res.status(statusCodes.BAD_REQUEST).json({
			error: error.name,
			message: error.message
		});
	}
});

//Editar usuário
router.put("/update/:id", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Parâmetros de update vazios");

		const updatedUser = await userService.update(Number(req.params.id), data);
		res.json(updatedUser).status(statusCodes.SUCCESS);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Excluir usuário
router.delete("/delete/:id", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.deleteByID(Number(req.params.id));
		res.json(user);
	}
	catch (error){
		next(error);
	}
});

export default router;