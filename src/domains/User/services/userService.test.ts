jest.mock("../../../../utils/functions/encryptPassword", () => ({
	__esModule: true,
	default: jest.fn(),
}));

import { prismaMock } from "../../../../config/singleton";
import UserService from "./userService";
import { User } from "@prisma/client";
import { userRoles } from "../../../../utils/constants/userRoles";
import encryptPassword from "../../../../utils/functions/encryptPassword";

const userService = new UserService;

describe("User: create", () => {

	const userData: User = {
		id: 1,
		name: "joao",
		email: "joao@email.com",
		photo: "photos/joao",
		password: "joao123",
		privileges: userRoles.USER
	};

	test("deve criar o usuario quando não há um usuário já criado com o email passado", async () => {
		prismaMock.user.findUnique.mockResolvedValue(null);
		(encryptPassword as jest.Mock).mockResolvedValue(userData.password + "_encriptada");
		prismaMock.user.create.mockResolvedValue(userData);

		const userCreated = await userService.create(userData);

		expect(encryptPassword).toHaveBeenCalledWith("joao123");
		expect(prismaMock.user.create).toHaveBeenCalledWith({
			data: {
				name: userData.name,
				email: userData.email,
				photo: userData.photo,
				password: "joao123_encriptada",
				privileges: userData.privileges
			}
		});
		expect(userCreated.id).toBe(1);
	});


});