const {Client, Account, ID, Databases, Query} = Appwrite
const projectId = '658778ab58c8c1e97d38'
const databaseId = '658a1e97977a621f3c5b'
const collectionId = '658a1ee065a60500459d'

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(projectId)

const account = new Account(client)
const database = new Databases(client)

async function register(event){
  event.preventDefault();

  try {
    const response = await account.create(
      ID.unique(),
      event.target.elements['register-email'].value,
      event.target.elements['register-password'].value,
      event.target.elements['register-username'].value
    );

    console.log(response);

    database.createDocument(
      databaseId,
      collectionId,
      response.$id,
      {
        "userId":  response.$id,
        "highscore": 0
      }
    );

    const emailSessionResponse = await account.createEmailSession(
      event.target.elements['register-email'].value,
      event.target.elements['register-password'].value,
    ).then(() => {
      showDisplay();
    });

    console.log('Email session created:', emailSessionResponse);

  } catch (error) {
    console.error('Error:', error);
  };

  async function login(event){

  };

  function showDisplay(){
    const modalElement = document.getElementById('modal');

    modalElement.classList.add('hidden')
  };
  //kaboom game
  function startGame(){
    kaboom({
      global: true,
      fullscreen: true,
      scale: 2
    })

    const moveSpeed = 120;
    const jumpForce = 360;
    const bigJumpForce = 550;
    let currentJumpForce = jumpForce;
    const fallDeath = 400;
    const enemyDeath = 20;

    //game logic
    let isJumping = true;

    loadRoot("https://i.imgur.com/")
    loadSprite("coin", "wbKxhcd.png")
    loadSprite("evil-shroom", "KPO3fR9.png")
    loadSprite("brick", "pogC9x5.png")
    loadSprite("block", "M6rwarW.png")
    loadSprite("mario", "49312nl.png")  //não achou
    loadSprite("mushroon", "0wMd92p.png")
    loadSprite("surprise", "gesQ1KP.png")
    loadSprite("unboxed", "bdrLpi6.png")
    loadSprite("pipe-top-left", "ReTPiWY.png")
    loadSprite("pipe-top-right", "hj2GK4n.png")
    loadSprite("pipe-bottom-left", "c1cYSbt.png")
    loadSprite("pipe-bottom-right", "nqQ79eI.png")
    loadSprite("blue-block", "bTf6mZo.jpeg") //não achou
    loadSprite("blue-brick", "3e5YRQd.png")
    loadSprite("blue-steel", "gqVoI2b.png")
    loadSprite("blue-evil-mushroom", "SvV4ueD.png")
    loadSprite("blue-surprise", "a6vJRGj.jpeg") //não achou
    loadSprite("", "")
    loadSprite("", "")
  };

  startGame()
}
