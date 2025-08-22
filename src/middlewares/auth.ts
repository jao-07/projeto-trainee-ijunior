import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prismaClient";
import comparePassword from "../../utils/functions/comparePassword";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import statusCodes from "../../utils/constants/statusCodes";
import { User } from "@prisma/client";
import { PermissionError } from "../../errors/PermissionError";
import { TokenError } from "../../errors/TokenError";
import { LoginError } from "../../errors/LoginError";
import {userRoles} from "../../utils/constants/userRoles";

dotenv.config();

function generateJWT(user: User): string{
	const payload = {
		email: user.email,
		name: user.name,
		id: user.id,
		privileges: user.privileges
	};

	return jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn: Number(process.env.JWT_EXPIRATION)});
}

export async function login (req: Request, res: Response){
	try{
		const {email, password} = req.body;
		const user = await prisma.user.findUnique({ where: { email: email}});

		if(!user){
			throw new PermissionError("Email e/ou senha incorretos");
		}

		const passwordsMatch = await comparePassword(password, user.password);
		if(!passwordsMatch){
			throw new PermissionError("Email e/ou senha incorretos");
		}

		const token = generateJWT(user);
        
		res.status(statusCodes.SUCCESS).cookie("jwt", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development"
		}).json("Login realizado com sucesso");
	}
	catch(error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
}

function cookieExtractor(req: Request){
	let token = null;
	if(req.cookies){
		token = req.cookies["jwt"];
	}
	return token;
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
	try{
		const token = cookieExtractor(req);

		if(token){
			const decoded = jwt.verify(token, process.env.SECRET_KEY || "") as JwtPayload;
			req.user = {
				email: decoded.email,
				name: decoded.name,
				id: decoded.id,
				privileges: decoded.privileges
			};
		}

		if(req.user == null)
			throw new TokenError("Você precisa estar logado para realizar essa ação");

		next();
	}
	catch(error: any){
		next(error);
	}
}

export function notLoggedIn(req: Request, res: Response, next: NextFunction){
	try{
		const token = cookieExtractor(req);
		if(token){
			jwt.verify(token, process.env.SECRET_KEY || "", (err: any, decoded: any) => {
				if(err)
					next();

				throw new LoginError("Usuário já está logado");
			});
		}
		next();
	}
	catch(error: any){
		res.status(statusCodes.UNAUTHORIZED).json({
			error: error.name,
			message: error.message
		});
	}
}

export function checkRole(requiredRoles: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user;
			if (!user || !user.privileges) {
				throw new PermissionError("Usuário não autenticado ou sem privilégios");
			}

			const hasPermission = requiredRoles === user.privileges;

			if (!hasPermission) {
				throw new PermissionError("Usuário não tem permissão para realizar essa ação");
			}
			next();
		} catch (error: any) {
			next();
		}
	};
}

export function logout(req: Request, res: Response) {
	try {
		res.clearCookie("jwt").status(statusCodes.SUCCESS).json("Logout realizado com sucesso");
	}
	catch (error: any) {
		res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
			error: error.name,
			message: error.message
		});
	}
}