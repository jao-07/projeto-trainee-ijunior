import { prismaMock } from "../../../../config/singleton";
import ArtistService from "./artistService";
import { Artist } from "@prisma/client";

const artistService = new ArtistService();

describe("artistService", () => {
	const artistData1: Artist = {
		id: 1,
		name: "Artista 1",
		photo: "foto.jpg",
		streams: 1,
	};
	const artistData2: Artist = {
		id: 2,
		name: "Artista 2",
		photo: "foto.jpg",
		streams: 1,
	};

	describe("create", () => {
		test("deve criar um novo artista", async () => {
			prismaMock.artist.create.mockResolvedValue(artistData1);

			const artistCreated = await artistService.createArtist(artistData1);
			expect(artistCreated.id).toBe(1);
		});

		test("deve lançar um erro ao tentar criar um artista já existente", async () => {
			prismaMock.artist.create.mockRejectedValue({
				code: "P2002",
				message: "O artista já existe",
			});
      
			await expect(artistService.createArtist(artistData1)).rejects.toMatchObject({
				code: "P2002",
			});
		});
	});

	describe("getArtists", () => {
		test("deve retornar todos os artistas cadastrados", async () => {
			prismaMock.artist.findMany.mockResolvedValue([artistData1, artistData2]);

			const artists = await artistService.getArtists();
			expect(prismaMock.artist.findMany).toHaveBeenCalledWith({
				orderBy: { name: "asc" },
			});
			expect(artists).toEqual([artistData1, artistData2]);
		});

		test("deve retornar vazio quando não houver artistas cadstrados", async () => {
			prismaMock.artist.findMany.mockResolvedValue([]);

			const artists = await artistService.getArtists();
			expect(artists).toEqual([]);
		});
	});

	describe("getArtistByID", () => {
		test("deve retornar um artista pelo ID", async () => {
			prismaMock.artist.findFirst.mockResolvedValue(artistData1);
        
			const artist = await artistService.getArtistByID(1);

			expect(prismaMock.artist.findFirst).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(artist).toEqual(artistData1);
		});

		test("deve retornar null quando não encontrar um artista com o ID passado", async () => {
			prismaMock.artist.findFirst.mockResolvedValue(null);

			const artist = await artistService.getArtistByID(3);

			expect(artist).toEqual(null);
			expect(prismaMock.artist.findFirst).toHaveBeenCalledWith({
				where: { id: 3 },
			});
		});
	});

	describe("getArtistByName", () => {
		test("deve retornar um artista pelo nome", async () => {
			prismaMock.artist.findFirst.mockResolvedValue(artistData1);

			const artist = await artistService.getArtistByName("Artista 1");

			expect(prismaMock.artist.findFirst).toHaveBeenCalledWith({
				where: { name: "Artista 1" },
			});
			expect(artist).toEqual(artistData1);
		});

		test("deve retornar nulo se não existir um artista com o nome passado", async () => {
			prismaMock.artist.findFirst.mockResolvedValue(null);

			const artist = await artistService.getArtistByName("Artista Inexistente");

			expect(artist).toBeNull();
		});
	});

	describe("update", () => {
		test("deve atualizar os dados de um artista", async () => {
			const updatedArtistData = { ...artistData1, name: "Artista Atualizado" };
			prismaMock.artist.update.mockResolvedValue(updatedArtistData);
			const artist = await artistService.update(1, { name: "Artista Atualizado" });

			expect(prismaMock.artist.update).toHaveBeenCalledWith({
				data: { name: "Artista Atualizado" },
				where: { id: 1 },
			});
			expect(artist).toEqual(updatedArtistData);
		});

		test("deve lançar um erro ao tentar atualizar um artista que não existe", async () => {
			prismaMock.artist.update.mockRejectedValue({
				code: "P2025",
				message: "O artista não existe",
			});
			await expect(artistService.update(999, { name: "Nome" })).rejects.toMatchObject({
				code: "P2025",
			});
		});
	});

	describe("addMusicToArtist", () => {
		const musicID = 10;
		const artistID = 1;
		const artistWithMusics = {
			...artistData1,
			musics: [
				{ id: musicID, name: "Música 1", duration: 200, artistId: artistID }
			]
		};

		test("deve adicionar uma música ao artista e retornar o artista com as músicas", async () => {
			prismaMock.artist.update.mockResolvedValue(artistWithMusics);

			const result = await artistService.addMusicToArtist(musicID, artistID);

			expect(prismaMock.artist.update).toHaveBeenCalledWith({
				where: { id: artistID },
				data: { musics: { connect: { id: musicID } } },
				include: { musics: true }
			});
			expect(result).toEqual(artistWithMusics);
		});

		test("deve lançar um erro ao tentar adicionar uma música a um artista inexistente", async () => {
			prismaMock.artist.update.mockRejectedValue({
				code: "P2025",
				message: "O artista não existe"
			});

			await expect(artistService.addMusicToArtist(musicID, 999)).rejects.toMatchObject({
				code: "P2025"
			});
		});
	});

	describe("deleteArtist", () => {
		test("deve deletar um artista de acordo com o ID", async () => {
			prismaMock.artist.delete.mockResolvedValue(artistData1);

			const artist = await artistService.deleteByID(1);

			expect(prismaMock.artist.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(artist).toEqual(artistData1);
		});

		test("deve lançar um erro ao tentar deletar um artista que não existe", async () => {
			prismaMock.artist.delete.mockRejectedValue({
				code: "P2025",
				message: "O artista não existe"
			});
			await expect(artistService.deleteByID(999)).rejects.toMatchObject({
				code: "P2025",
			});
		});
	});
});