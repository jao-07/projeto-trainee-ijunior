import { Router, Request, Response, NextFunction } from 'express';
import MusicService from '../services/musicService';
import {login, notLoggedIn, verifyJWT, checkRole, logout} from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";
import { InvalidParamError } from "../../../../errors/InvalidParamError";

const router = Router();
const musicService = new MusicService;

router.get("/musics", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await musicService.getMusics();
		res.status(statusCodes.SUCCESS).json(musics);
	} catch (error) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//achar música por id
router.get("/musics/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicService.getMusicById(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(music);
	} 
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message:error.message
		});
	}
});

router.get("/music/:name", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicService.getMusicByName(req.params.name);
		res.json(music);
	} catch (error) {
		next(error);
	}
});
//listar musicas de um artista
router.get("/musics/artist/:id", verifyJWT, async (req:Request, res: Response) => {
	try{
		const musics = await musicService.getMusicsByArtist(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});


//criar música
router.post("/musics/create", verifyJWT, checkRole("ADMIN"), async (req: Request, res: Response) => {
	try {
		const data = req.body;
		if(!data)
			throw new Error("Campos da música vazios");
		const music = await musicService.create(data, data.artistIds);
		res.status(statusCodes.SUCCESS).json(music);
	} catch (error:any) {
		res.status(statusCodes.BAD_REQUEST).json({
			error: error.name,
			message: error.message
		});
	}
});

//Editar música
router.put("/musics/update/:id", verifyJWT, checkRole("ADMIN"), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Parâmetros de update vazios");

		const music = await musicService.update(Number(req.params.id), data);
		res.status(statusCodes.SUCCESS).json(music);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Deletar música
router.delete("/musics/delete/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicService.deleteMusic(Number(req.params.id));
		res.json(music);
	} catch (error) {
		next(error);
	}
});



export default router;