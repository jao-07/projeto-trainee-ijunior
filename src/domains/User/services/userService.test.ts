import { prismaMock } from "../../../../config/singleton";
import UserService from "./userService";
import { User } from "@prisma/client";
import { userRoles } from "../../../../utils/constants/userRoles";
import bcrypt from "bcrypt";
import { QueryError } from "../../../../errors/QueryError";

const userService = new UserService;

jest.mock("bcrypt");

describe("userService", () => {

	const userData1: User = {
		id: 1,
		name: "joao",
		email: "joao@email.com",
		photo: "photos/joao",
		password: "joao123",
		privileges: userRoles.USER
	};

	const userData2: User = {
		id: 2,
		name: "cecilia",
		email: "cecilia@email.com",
		photo: "photos/cecilia",
		password: "cecilia123",
		privileges: userRoles.ADMIN
	};

	(bcrypt.hash as jest.Mock).mockResolvedValue(userData1.password + "_encriptada");

	describe("create", () => {

		test("deve criar o usuario quando não há um usuário já criado com o email passado", async () => {
			prismaMock.user.findUnique.mockResolvedValue(null);
			prismaMock.user.create.mockResolvedValue(userData1);

			const userCreated = await userService.create(userData1);

			expect(bcrypt.hash).toHaveBeenCalledWith("joao123", 10);
			expect(prismaMock.user.create).toHaveBeenCalledWith({
				data: {
					name: userData1.name,
					email: userData1.email,
					photo: userData1.photo,
					password: "joao123_encriptada",
					privileges: userData1.privileges
				}
			});
			expect(userCreated.id).toBe(1);
		});

		test("deve gerar erro ao tentar criar um usuário com um email já existente no sistema", async () => {
			prismaMock.user.findUnique.mockResolvedValue(userData1);
			await expect(userService.create(userData1)).rejects.toThrow(QueryError);
			expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
				where: { email: userData1.email },
			});
			expect(prismaMock.user.create).not.toHaveBeenCalled();
		});
	});

	describe("getUsers", () => {
		test("deve retornar todos os usuários cadastrados", async () => {
			prismaMock.user.findMany.mockResolvedValue([userData1, userData2]);
			const users = await userService.getUsers();
			expect(users).toEqual([userData1, userData2]);
			expect(prismaMock.user.findMany).toHaveBeenCalled();
		});

		test("deve retornar vazio quando não tiver usuários cadastrados", async () => {
			prismaMock.user.findMany.mockResolvedValue([]);
			const users = await userService.getUsers();
			expect(users).toEqual([]);
			expect(prismaMock.user.findMany).toHaveBeenCalled();
		});
	});

	describe("getUserByID", () => {
		test("deve retornar o usuário do ID passado", async () => {
			prismaMock.user.findFirst.mockResolvedValue(userData2);
			const user = await userService.getUserByID(2);
			expect(user).toEqual(userData2);
			expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
				where: {id: userData2.id}
			});
		});

		test("deve retornar nulo quando não haver usuário com o ID passado", async () => {
			prismaMock.user.findFirst.mockResolvedValue(null);
			const user = await userService.getUserByID(3);
			expect(user).toEqual(null);
			expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
				where: {id: 3}
			});
		});
	});

	describe("update", () => {
		test("deve atualizar os dados do usuário do ID passado, com as informações passadas, sem trocar senha", async () => {
			const dataPassed = {
				name: "Joao Victor",
				photo: "photos/outraFoto"
			};
			const updatedUser = {...userData1, ...dataPassed};
			prismaMock.user.update.mockResolvedValue(updatedUser);
			const user = await userService.update(1, dataPassed);
			expect(user).toEqual(updatedUser);
			expect(prismaMock.user.update).toHaveBeenCalledWith({
				data: dataPassed,
				where: {
					id: 1
				}
			});
		});

		test("deve encriptar a senha e atualizar o usuário", async () => {
			const dataPassed = {
				name: "Joao Victor",
				password: "outraSenha123"
			};
			const updatedUser = {...userData1, ...dataPassed};
			prismaMock.user.update.mockResolvedValue({...updatedUser, password: "outraSenha123_encriptada"});
			const user = await userService.update(1, dataPassed);
			expect(bcrypt.hash).toHaveBeenCalledWith("outraSenha123", 10);
			expect(user).toEqual({...updatedUser, password: "outraSenha123_encriptada"});
			expect(prismaMock.user.update).toHaveBeenCalledWith({
				data: dataPassed,
				where: {
					id: 1
				}
			});
		});

		test("deve gerar erro ao passar um atributo inválido como parâmetro", async () => {
			const dataPassed = {
				name: "Joao Victor",
				invalid: "invalid parameter"
			};

			prismaMock.user.update.mockRejectedValue(
				new Error("Unknown arg `invalid` in data.invalid for type UserUpdateInput.")
			);

			await expect(userService.update(1, dataPassed))
				.rejects
				.toThrow("Unknown arg `invalid`");

			expect(prismaMock.user.update).toHaveBeenCalledWith({
				data: dataPassed,
				where: {
					id: 1
				}
			});
		});
	});

	describe("addMusicToUser", () => {
		test("deve adicionar a música ao usuário e retornar os dados do usuário com as músicas", async () => {
			const musicAdded = {
				id: 1,
				name: "music1",
				genre: "genre1",
				album: "album1",
				artists: []
			};
			prismaMock.user.update.mockResolvedValue({ ...(userData1 as User), musics: [musicAdded] } as User & { musics: typeof musicAdded[] });
			const user = await userService.addMusicToUser(1, 1);
			expect(user).toEqual({...userData1, musics: [musicAdded]});
			expect(prismaMock.user.update).toHaveBeenCalledWith({
				data: {
					musics: { connect: { id: 1 } }
				},
				where: { id: 1 },
				include: { musics: true }
			});
		});
	});

	describe("deleteByID", () => {
		test("deve deletar um usuário que está cadastrado", async () => {
			prismaMock.user.delete.mockResolvedValue(userData2);
			const user = await userService.deleteByID(2);
			expect(user).toEqual(userData2);
			expect(prismaMock.user.delete).toHaveBeenCalledWith({
				where: {id: userData2.id}
			});
		});

		test("deve lançar erro ao tentar deletar um usuário que não está cadastrado", async () => {
			prismaMock.user.delete.mockRejectedValue({
				code: "P2025",
				message: "Registro não encontrado",
			});
			await expect(userService.deleteByID(999)).rejects.toMatchObject({
				code: "P2025",
			});
			expect(prismaMock.user.delete).toHaveBeenCalledWith({
				where: { id: 999 },
			});
		});
	});
});