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
      scale: 2,
      clearColor: [0,0,0,1]
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
    loadSprite("mario", "Wb1qfhK.png")
    loadSprite("mushroom", "0wMd92p.png")
    loadSprite("surprise", "gesQ1KP.png")
    loadSprite("unboxed", "bdrLpi6.png")
    loadSprite("pipe-top-left", "ReTPiWY.png")
    loadSprite("pipe-top-right", "hj2GK4n.png")
    loadSprite("pipe-bottom-left", "c1cYSbt.png")
    loadSprite("pipe-bottom-right", "nqQ79eI.png")
    loadSprite("blue-block", "fVscIbn.png")
    loadSprite("blue-brick", "3e5YRQd.png")
    loadSprite("blue-steel", "gqVoI2b.png")
    loadSprite("blue-evil-shroom", "SvV4ueD.png")
    loadSprite("blue-surprise", "RMqCc1G.png") 

    scene("game",({level, score}) => {
      layers(["bg", "obj", "ui"], "obj")
      const maps = [
        [      
          '                                      ',
          '                                      ',
          '                                      ',
          '                                      ',
          '                                      ',
          '    %  =*=%                           ',
          '                                      ',
          '                         -+           ',
          '             ^      ^    ()           ',
          '==============================   ====='
        ],
        [      
          '£                                              £',
          '£                                              £',
          '£                                              £',
          '£                                              £',
          '£                                              £',
          '£      @@@@@@                    xx            £',
          '£                               xxx            £',
          '£                              xxxx      x   -+£',
          '£             z      z        xxxxx      x   ()£',
          '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
        ]
      ]


      const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '}': [sprite('unboxed'), solid()],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '$': [sprite('coin'), 'coin'],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],        
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(),'dangerous'],
        '#': [sprite('mushroom'), solid(),'mushroom', body()],
        '!': [sprite('blue-block'), solid(),scale(0.5)],
        '£': [sprite('blue-brick'), solid(),scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(),scale(0.5),'dangerous'],
        '@': [sprite('blue-surprise'), solid(),scale(0.5),'coin-surprise'],
        'x': [sprite('blue-steel'), solid(),scale(0.5)],
      };

      const gameLevel = addLevel(maps[level], levelConfig);

      //adicionando o score em tela
      const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
          value: score
        }
      ])

      //adicionando o level em tela
      add([text('  level  ' + parseInt(level + 1)),pos(40, 6)])

      const player = add([
        sprite("mario"), 
        solid(),
        pos(30, 0),
        body(),
        origin('bot')
      ]);

      // Example: Move the player left and right
      keyDown("left", () => {
        player.move(-moveSpeed, 0);
      });

      keyDown("right", () => {
        player.move(moveSpeed, 0);
      });

      // Example: Make the player jump
      keyPress("space", () => {
        if (player.grounded()) {
          player.jump(currentJumpForce);
        }
      });

    })

    start("game", {level: 0, score: 0})
  };

  startGame()
}
