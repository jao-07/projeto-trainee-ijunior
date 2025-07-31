import UserService from "./src/service/userService"

async function main(){
    const userService = new UserService

    const userData = {
        password: "outraSenha",
        privileges: true
    }

    const user = await userService.deleteByEmail("maria@email.com")
    console.log(user)
}

main()