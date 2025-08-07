import prisma from "../../../config/prismaClient";
import { Music } from "@prisma/client";
import { Artist } from "@prisma/client";

export default class MusicService {
  // C (CREATE)
  async create(musicData: Music, artistIds: number[]) {
    return await prisma.music.create({
      data: {
        name: musicData.name,
        duration: musicData.duration,
        genre: musicData.genre,
        album: musicData.album,
        artists: {
          connect: artistIds.map((id) => ({ id })),
        },
      },
      include: { artists: true },
    });
  }

  // R (READ)
  async getMusics() {
    return await prisma.music.findMany();
  }

  async getMusicById(musicID: number) {
    return await prisma.music.findFirst({
      where: {
        id: musicID,
      },
    });
  }

  async getMusicByName(musicName: string) {
    return await prisma.music.findFirst({
      where: {
        name: musicName,
      },
    });
  }

  // Retorna todas as músicas de um artista 
  async getMusicsByArtist (artistID: number) {
    return await prisma.music.findMany({
      where: {
        artists: { some: { id: artistID } }
      },
      include: { artists: true }
    });
  }

  // U (UPDATE)
  async update(musicID: number, musicData: any) {
    return await prisma.music.update({
      data: musicData,
      where: {
        id: musicID,
      },
    });
  }

  // D (DELETE)
  async deleteMusic(musicID: number) {
    return await prisma.music.delete({
      where: {
        id: musicID,
      },
    });
  }
}