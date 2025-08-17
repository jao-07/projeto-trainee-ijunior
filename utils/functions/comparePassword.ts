import bcrypt from 'bcrypt'

async function comparePassword(password: string, hash: string) : Promise<Boolean> {
    const compareResult = await bcrypt.compare(password, hash);
    return compareResult;  
}

export default comparePassword