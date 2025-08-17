import bcrypt from 'bcrypt'

async function encryptPassword(password: string) : Promise<string> { //Função para criptografar uma senha
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export default encryptPassword