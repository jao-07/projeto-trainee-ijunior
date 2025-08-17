import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient"
import encryptPassword from "../../utils/functions/encryptPassword";
import { QueryError } from "../../errors/QueryError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import statusCodes from "../../utils/constants/statusCodes";

dotenv.config();

async function login (req: Request, res: Response) {
    try{
        const {email, password} = req.body;
        const encryptedPassword = await encryptPassword(password);
        const user = await prisma.user.findUnique({ where: { email: email, password: encryptedPassword} })

        if(!user){
            throw new QueryError('Usuário inválido para o email e senha informados')
        }

        const payload = {
            email: email,
            name: user.name,
            id: user.id,
            privileges: user.privileges
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn: Number(process.env.JWT_EXPIRATION)})
        res.status(statusCodes.SUCCESS).json({token: token})
    }
    catch(error){
        res.status(statusCodes.UNAUTHORIZED)
    }
}

export default login