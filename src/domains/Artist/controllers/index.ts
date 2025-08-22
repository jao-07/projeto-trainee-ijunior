/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import ArtistService  from "../../Artist/services/artistService";
import { verifyJWT, checkRole } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";
import { InvalidParamError } from "../../../../errors/InvalidParamError";

const router = Router();
const artistService = new ArtistService;

//Listar artistas (ordem alfabética)
router.get("/", verifyJWT, async (req: Request, res: Response) => {
	try{
		const artists = await artistService.getArtists();
		res.json(artists).status(statusCodes.SUCCESS);
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
		res.json(artist).status(statusCodes.SUCCESS);
	}
	catch (error: any) {
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Criar artista
router.post("/create", verifyJWT, checkRole("ADMIN"), async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Campos do usuário vazios");
		const artist = await artistService.createArtist(data);
		res.json(artist).status(statusCodes.SUCCESS);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

//Editar artista
router.put("/update/:id", verifyJWT, checkRole("ADMIN"), async (req: Request, res: Response) => {
	try{
		const data = req.body;
		if(!data)
			throw new InvalidParamError("Parâmetros de update vazios");

		const artist = await artistService.update(Number(req.params.id), data);
		res.json(artist).status(statusCodes.SUCCESS);
	}
	catch (error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
});

router.delete("/artists/delete/:id", verifyJWT, checkRole("ADMIN"), async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await artistService.deleteByID(Number(req.params.id));
		res.json(artist);
	}
	catch (error){
		next(error);
	}
});

router.put("/:id/music/:musicID", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await artistService.addMusicToArtist(Number(req.params.musicID), Number(req.params.id));
		res.json(artist);
	}
	catch (error) {
		next(error);
	}
});

router.get("/name/:name", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await artistService.getArtistByName(req.params.name);
		res.json(artist);
	}
	catch (error) {
		next(error);
	}
});



export default router;