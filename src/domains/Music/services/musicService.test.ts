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
    
    describe("getMusicById", () => {
        test("deve retornar a música do ID passado", async () => {
            prismaMock.music.findFirst.mockResolvedValue(musicData1);
            const music = await musicService.getMusicById(10);
            expect(music).toEqual(musicData1);
            expect(prismaMock.music.findFirst).toHaveBeenCalledWith({
                where: {id: musicData1.id}
            });
        });

        test("deve retornar null quando não encontrar música com o ID passado", async () => {
            prismaMock.music.findFirst.mockResolvedValue(null);
            const music = await musicService.getMusicById(999);
            expect(music).toEqual(null);
            expect(prismaMock.music.findFirst).toHaveBeenCalledWith({
                where: {id: 999}
            });
        });
    });

        describe("getMusicByName", () => {
        test("deve retornar a música do nome passado", async () => {
            prismaMock.music.findFirst.mockResolvedValue(musicData1);
            const music = await musicService.getMusicByName("Song A");
            expect(music).toEqual(musicData1);
            expect(prismaMock.music.findFirst).toHaveBeenCalledWith({
                where: {name: musicData1.name}
            });
        });

        test("deve retornar null quando não encontrar música com o nome passado", async () => {
            prismaMock.music.findFirst.mockResolvedValue(null);
            const music = await musicService.getMusicByName("Nonexistent Song");
            expect(music).toEqual(null);
            expect(prismaMock.music.findFirst).toHaveBeenCalledWith({
                where: {name: "Nonexistent Song"}
            });
        });
    });

    describe("update", () => {
        test("deve atualizar os dados da música do ID passado, com as informações passadas", async () => {
            const dataPassed = {
                name: "Song A Updated",
                genre: "Rock"
            };
            const updatedMusic = {...musicData1, ...dataPassed};
            prismaMock.music.update.mockResolvedValue(updatedMusic);
            const music = await musicService.update(10, dataPassed);
            expect(music).toEqual(updatedMusic);
            expect(prismaMock.music.update).toHaveBeenCalledWith({
                data: dataPassed,
                where: {
                    id: 10
                },
            });
        });

        test("deve gerar erro ao passar um atributo inválido como parâmetro", async () => {
            const dataPassed = {
                name: "Song A Updated 2",
                invalid: "invalid parameter"
            };
            prismaMock.music.update.mockRejectedValue(
                new Error("Invalid field 'invalid' for update")
            );

            await expect(musicService.update(10, dataPassed))
            .rejects
            .toThrow("Unknown arg 'invalid'");

            expect(prismaMock.music.update).toHaveBeenCalledWith({
                data: dataPassed,
                where: {
                    id: 10
                }
            });
        });  
    });
    
    describe("deleteMusic", () => {
        test("deve deletar a música do ID passado", async () => {
            prismaMock.music.delete.mockResolvedValue(musicData1);
            const music = await musicService.deleteMusic(10);
            expect(music).toEqual(musicData1);
            expect(prismaMock.music.delete).toHaveBeenCalledWith({
                where: {id: 10}
            });
          });
        
        test("deve gerar erro ao tentar deletar música com ID que não existe", async () => {
            prismaMock.music.delete.mockRejectedValue({
                code: "P2025",
                message: "ID não encontrado"
            });
            await expect(musicService.deleteMusic(999)).rejects.toMatchObject({
                code: "P2025"
            });
            expect(prismaMock.music.delete).toHaveBeenCalledWith({
                where: {id: 999}
            });
        });
    });

});


