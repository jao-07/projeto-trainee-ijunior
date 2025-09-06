import prisma from "../../../../config/prismaClient";
import { Artist } from "@prisma/client";

export default class ArtistService {
	async createArtist(artistData: Artist){
		return await prisma.artist.create({
			data: {
				name: artistData.name,
				photo: artistData.photo,
				streams: artistData.streams
			}
		});
	}
    
	async getArtists() {
		return await prisma.artist.findMany({orderBy: {name: "asc"}});
	}

	async getArtistByID(artistID: number){
		return await prisma.artist.findFirst({where: {id: artistID}});
	}

	async getArtistByName(artistName: string){
		return await prisma.artist.findFirst({where: {name: artistName}});
	}   

	async update(artistID: number, artistData: Partial<Artist>){
		return await prisma.artist.update({
			data: artistData,
			where: {
				id: artistID
			}
		});
	}
    
	// Faz com que apareça os dados da música na resposta
	async addMusicToArtist(musicID: number, artistID: number){
		return await prisma.artist.update({
			where: { id: artistID },
			data: {
				musics: { connect: { id: musicID } }
			},
			include: { musics: true }
		});
	}

	async deleteByID(artistID: number){
		return await prisma.artist.delete({where:{id: artistID}});
	}
}