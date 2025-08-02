import prisma from "../../config/prismaClient"
import { Artist } from "@prisma/client"

export default class ArtistService {
    async createArtist(artistData: Artist){
        return await prisma.artist.create({
            data: {
                name: artistData.name,
                photo: artistData.photo,
                streams: artistData.streams
            }
        })
    }
    
    async getArtists() {
        return await prisma.artist.findMany()
    }

    async getArtistByID(artistID: number){
        return await prisma.artist.findFirst({where: {id: artistID}})
    }

    async getArtistByName(artistName: string){
        return await prisma.artist.findFirst({where: {name: artistName}})
    }   

    async update(artistID: number, artistData: any){
        return await prisma.artist.update({
            data: artistData,
            where: {
                id: artistID
            }
        })
    }
    
    async addMusicToArtist(musicID: number, artistID: number){
        return await prisma.artist.update({
            data:{
                musics:{ connect: {id: musicID} }
            },
            where:{id: artistID}        
        })
    }

    async deleteByID(artistID: number){
        return await prisma.artist.delete({where:{id: artistID}})
    }
}