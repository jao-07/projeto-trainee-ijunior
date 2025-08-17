import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import { QueryError } from "../../../../errors/QueryError";
import encryptPassword from "../../../../utils/functions/encryptPassword";

export default class UserService {

	async create(userData: User){

		if(await prisma.user.findUnique({ where: { email: userData.email } })) {
            throw new QueryError('Email já cadastrado.');
        }

		userData.password = await encryptPassword(userData.password);

		return await prisma.user.create({
			data: {
				name: userData.name,
				email: userData.email,
				photo: userData.photo,
				password: userData.password,
				privileges: false
			}
		});
	}

	async getUsers() {
		return await prisma.user.findMany();
	}

	async getUserByID(userID: number){
		return await prisma.user.findFirst({where: {id: userID}});
	}

	async getUserByEmail(userEmail: string){
		return await prisma.user.findFirst({where: {email: userEmail}});
	}

	async update(userID: number, userData: Partial<User>){
		return await prisma.user.update({
			data: userData,
			where: {
				id: userID
			}
		});
	}

	async addMusicToUser(musicID: number, userID: number){
		return await prisma.user.update({
			data: {
				musics: { connect: { id: musicID } }
			},
			where: { id: userID },
			include: { musics: true }
		});
	}

	async deleteByID(userID: number){
		return await prisma.user.delete({where:{id: userID}});
	}

	async deleteByEmail(userEmail: string){
		return await prisma.user.delete({where:{email: userEmail}});
	}
}