/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import ArtistService  from "../../Artist/services/artistService";
import { verifyJWT, checkRole } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { userRoles } from "../../../../utils/constants/userRoles";

const router = Router();
const artistService = new ArtistService;

//Listar artistas (ordem alfabética)
router.get("/", verifyJWT, async (req: Request, res: Response) => {
	try{
		const artists = await artistService.getArtists();
		res.status(statusCodes.SUCCESS).json(artists);
	}
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Visualizar artista específico
router.get("/:id", verifyJWT, async (req: Request, res: Response) => {
	try{
		const artist = await artistService.getArtistByID(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artist);
	}
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Criar artista
router.post("/create", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Campos do usuário vazios");
		const artist = await artistService.createArtist(data);
		res.status(statusCodes.CREATED).json(artist);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Editar artista
router.put("/update/:id", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Parâmetros de update vazios");

		const artist = await artistService.update(Number(req.params.id), data);
		res.status(statusCodes.SUCCESS).json(artist);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Deletar artista
router.delete("/delete/:id", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await artistService.deleteByID(Number(req.params.id));
		res.status(statusCodes.NO_CONTENT).json(artist);
	}
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Adicionar música a um artista
router.put("/:id/music/:musicID", verifyJWT, checkRole(userRoles.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await artistService.addMusicToArtist(Number(req.params.musicID), Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artist);
	}
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

// Busca um artista pelo nome
router.get("/name/:name", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await artistService.getArtistByName(req.params.name);
		res.status(statusCodes.SUCCESS).json(artist);
	}
	catch (error: any) {
		res.status(statusCodes.BAD_REQUEST).json({
			error: error.name,
			message: error.message
		});
	}
});

export default router;