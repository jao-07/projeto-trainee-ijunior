import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient"
import comparePassword from "../../utils/functions/comparePassword";
import { QueryError } from "../../errors/QueryError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import statusCodes from "../../utils/constants/statusCodes";

dotenv.config();

async function login (req: Request, res: Response){
    try{
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({ where: { email: email}})

        if(!user){
            throw new QueryError('Erro ao fazer login: Email inválido')
        }

        const passwordsMatch = await comparePassword(password, user.password);
        if(!passwordsMatch){
            throw new QueryError('Erro ao fazer login: Senha inválida')
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
    catch(error: any){
        res.status(statusCodes.UNAUTHORIZED).json({
            error: error.name,
            message: error.message
        })
    }
}

export default login