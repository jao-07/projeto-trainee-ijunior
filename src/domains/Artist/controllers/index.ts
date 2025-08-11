import { Router, Request, Response, NextFunction } from "express";
import ArtistService  from "../../Artist/services/artistService";

const router = Router();
const artistService = new ArtistService;

router.get("/artist", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const artists = await artistService.getArtists();
        res.json(artists);
    }
    catch (error) {
        next(error);
    }
});

router.get("/artist/:id", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const artist = await artistService.getArtistByID(Number(req.params.id));
        res.json(artist);
    }
    catch (error) {
        next(error);
    }
});

router.post("/artist", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = req.body;
        const artist = await artistService.createArtist(data);
        res.json(artist);
    }
    catch (error){
        next(error);
    }
});

router.get("/artist/:name", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const artist = await artistService.getArtistByName(req.params.name);
        res.json(artist);
    }
    catch (error) {
        next(error);
    }
});

router.put("/artist/:id", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = req.body;
        const artist = await artistService.updateArtist(Number(req.params.id), data);
        res.json(artist);
    }
    catch (error){
        next(error);
    }
});

router.delete("/artist/:id", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const artist = await artistService.deleteByID(Number(req.params.id));
        res.json(artist);
    }
    catch (error){
        next(error);
    }
});

router.put("/artist/:id/music/:musicID", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const artist = await artistService.addMusicToArtist(Number(req.params.musicID), Number(req.params.id));
        res.json(artist);
    }
    catch (error) {
        next(error);
    }
});

router.get("/artist/name/:name", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const artist = await artistService.getArtistByName(req.params.name);
        res.json(artist);
    }
    catch (error) {
        next(error);
    }
});



export default router;