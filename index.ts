import UserService from "./src/service/userService"
import ArtistService from "./src/service/artistService"
import MusicService from "./src/service/musicService"

async function main() {
  const userService = new UserService();
  const artistService = new ArtistService();
  const musicService = new MusicService();
  /* 
  const userData = {
    password: "outraSenha",
    privileges: true,
  };

  const user = await userService.deleteByEmail("maria@email.com");
  console.log(user); 
  */
  
  const teste = {
    id: 34,
    name: "Cesar",
    photo: null,
    streams: 36,
  };

  const arti = await artistService.createArtist(teste);
  console.log(arti); 

  // Cria um usuario teste
  const userTest = await userService.create({
    name: "Usuário teste",
    email: "teste@gmail.com",
    password: "asjdhiow",
    photo: null,
    privileges: false,
    id: 1
  });
  console.log(userTest);

  
  // Cria uma música teste 
  const music = await musicService.create(
    {
      name: "Música Teste",
      duration: 354,
      genre: "Samba",
      album: "Teste",
      id: 1,
    },
    [1]
  );
  console.log(music);
  

  // Associa música ao usuário
  const listening = await userService.addMusicToUser(3, 3); // Teste c/ id de música (3) e usuário (3) já existentes
  console.log("Relação user - música: ", {
    userId: listening.id,
    musics: listening.musics
  });
}

main();