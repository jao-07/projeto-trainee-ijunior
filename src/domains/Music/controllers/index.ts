import { Router, Request, Response, NextFunction } from 'express';
import MusicService from '../services/musicService';
import { verifyJWT, checkRole } from '../../../middlewares/auth';

const router = Router();
const musicService = new MusicService;

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await musicService.getMusics();
		res.json(musics);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicService.getMusicById(Number(req.params.id));
		res.json(music);
	} catch (error) {
		next(error);
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

router.get("/artist/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await musicService.getMusicsByArtist(Number(req.params.id));
		res.json(musics);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = req.body;
		const music = await musicService.create(data, data.artistIds);
		res.json(music);
	} catch (error) {
		next(error);
	}
});

router.put("/musics/update/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = req.body;
		const music = await musicService.update(Number(req.params.id), data);
		res.json(music);
	} catch (error) {
		next(error);
	}
});

router.delete("/musics/delete/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicService.deleteMusic(Number(req.params.id));
		res.json(music);
	} catch (error) {
		next(error);
	}
});

export default router;