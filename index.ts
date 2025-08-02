import UserService from "./src/service/userService"
import ArtistService from "./src/service/artistService"

async function main(){
    const userService = new UserService
    const artistService = new ArtistService()

    const userData = {
       password: "outraSenha",
        privileges: true
    }

    const user = await userService.deleteByEmail("maria@email.com")
    console.log(user)

    const teste = {
        id: 34,
        name: "Cesar",
        photo: null,
        streams: 36
    }

    const arti = await artistService.createArtist(teste)
    console.log(arti);
}

main()