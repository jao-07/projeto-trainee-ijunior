import { prismaMock } from "../../../../config/singleton";      
import MusicService from "./musicService";
import { Music } from "@prisma/client";

const musicService = new MusicService;

describe("musicService", () => {

    const musicData1: Music = {
        id: 10,
        name: "Song A",
        duration: 200,
        genre: "Pop",
        album: "Album A",
    };
    
    const artistsIds = [1];

    describe("create", () => {

        test("deve criar a música", async () => {
            prismaMock.music.create.mockResolvedValue(musicData1);
            const musicCreated = await musicService.create(musicData1, artistsIds);

            expect(musicCreated.id).toBe(10);
        });
    });

    describe("getMusics", () => {
        test("deve retornar todas as músicas cadastradas", async () => {
            prismaMock.music.findMany.mockResolvedValue([musicData1]);
            const musics = await musicService.getMusics();
            expect(musics).toEqual([musicData1]);
            expect(prismaMock.music.findMany).toHaveBeenCalled();
        });

        test("deve retornar uma lista vazia quando não houver músicas cadastradas", async () => {
            prismaMock.music.findMany.mockResolvedValue([]);
            const musics = await musicService.getMusics();
            expect(musics).toEqual([]);
            expect(prismaMock.music.findMany).toHaveBeenCalled();
        });
    });
    
});


