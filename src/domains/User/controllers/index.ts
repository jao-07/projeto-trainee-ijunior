import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/userService";

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

export default router;