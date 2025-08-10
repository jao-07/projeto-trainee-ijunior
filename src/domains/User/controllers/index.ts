import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/userService";
import ArtistService  from "../../Artist/services/artistService";


const router = Router();
const userService = new UserService;
const artistService = new ArtistService;

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


// Artist routes
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