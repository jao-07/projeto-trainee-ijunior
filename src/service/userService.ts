import prisma from "../../config/prismaClient"
import { User } from "@prisma/client"

export default class UserService {
    async create(userData: User){
        return await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                photo: userData.photo,
                password: userData.password,
                privileges: userData.privileges
            }
        })
    }

    async getUsers() {
        return await prisma.user.findMany()
    }

    async getUserByID(userID: number){
        return await prisma.user.findFirst({where: {id: userID}})
    }

    async getUserByEmail(userEmail: string){
        return await prisma.user.findFirst({where: {email: userEmail}})
    }

    async update(userID: number, userData: any){
        return await prisma.user.update({
            data: userData,
            where: {
                id: userID
            }
        })
    }

    async addMusicToUser(musicID: number, userID: number){
        return await prisma.user.update({
            data:{
                musics:{ connect: {id: musicID} }
            },
            where:{id: userID}
        })
    }

    async deleteByID(userID: number){
        return await prisma.user.delete({where:{id: userID}})
    }

    async deleteByEmail(userEmail: string){
        return await prisma.user.delete({where:{email: userEmail}})
    }
}