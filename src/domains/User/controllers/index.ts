import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/userService";
import {checkRole, login, notLoggedIn, verifyJWT} from "../../../middlewares/auth";

const router = Router();
const userService = new UserService;

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const users = await userService.getUsers();
		res.json(users);
	}
	catch (error) {
		next(error);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.getUserByID(Number(req.params.id));
		res.json(user);
	}
	catch (error) {
		next(error);
	}
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const data = req.body;
		const user = await userService.create(data);
		res.json(user);
	}
	catch (error){
		next(error);
	}
});

router.post("/login", notLoggedIn, login)

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const data = req.body;
		const user = await userService.update(Number(req.params.id), data);
		res.json(user);
	}
	catch (error){
		next(error);
	}
});

router.put("/:id/music/:musicID", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.addMusicToUser(Number(req.params.musicID), Number(req.params.id));
		res.json(user);
	}
	catch (error){
		next(error);
	}
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.deleteByID(Number(req.params.id));
		res.json(user);
	}
	catch (error){
		next(error);
	}
});

router.get("/email/:email", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.getUserByEmail(req.params.email);
		res.json(user);
	}
	catch (error) {
		next(error);
	}
});

router.delete("/users/delete/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.deleteByEmail(req.params.email);
		res.json(user);
	}
	catch (error){
		next(error);
	}
});

export default router;