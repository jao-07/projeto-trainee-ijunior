import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prismaClient"
import comparePassword from "../../utils/functions/comparePassword";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import statusCodes from "../../utils/constants/statusCodes";
import { User } from "@prisma/client";
import { PermissionError } from "../../errors/PermissionError";
import { TokenError } from "../../errors/TokenError";

dotenv.config();

function generateJWT(user: User): string{
    const payload = {
        email: user.email,
        name: user.name,
        id: user.id,
        privileges: user.privileges
    }

    return jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn: Number(process.env.JWT_EXPIRATION)})
}

export async function login (req: Request, res: Response, next: NextFunction){
    try{
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({ where: { email: email}})

        if(!user){
            throw new PermissionError('Email e/ou senha incorretos')
        }

        const passwordsMatch = await comparePassword(password, user.password);
        if(!passwordsMatch){
            throw new PermissionError('Email e/ou senha incorretos')
        }

        const token = generateJWT(user)
        
        res.status(statusCodes.NO_CONTENT).cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development"
        })
    }
    catch(error: any){
        next(error)
    }
}

function cookieExtractor(req: Request){
    let token = null
    if(req.cookies){
        token = req.cookies["jwt"]
    }
    return token
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    try{
        const token = cookieExtractor(req)

        if(token){
            const decoded = jwt.verify(token, process.env.SECRET_KEY || "") as JwtPayload
            req.user = decoded.user
        }

        if(req.user == null)
            throw new TokenError("Você precisa estar logado para realizar essa ação")

        next()
    }
    catch(error: any){
        next(error)
    }
}