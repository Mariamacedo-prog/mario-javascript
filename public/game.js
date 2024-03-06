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


  //Kaboom game
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
    const enemySpeed = 20;

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

    //  Telas
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

      //  Adicionando o score em tela
      const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
          value: score
        }
      ])

      //  Adicionando o level em tela
      add([text('  level  ' + parseInt(level + 1)),pos(40, 6)])


      const player = add([
        sprite("mario"), 
        solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot')
      ]);

      function big(){
        let timer = 0
        let isBig = false

        return {
          update(){
            if(isBig){
              currentJumpForce = bigJumpForce
              timer -= dt()
              if(timer <= 0){
                this.smallify()
              }
            }
          },
          isBig(){
            return isBig
          },
          smallify(){
            this.scale = vec2(1)

            currentJumpForce = jumpForce
            timer = 0
            isBig = false
          },
          biggify(time){
            this.scale = vec2(2)
            timer = time
            isBig = true
          }
        }
      }

      //  Quando morrer aparecer o score
      player.action(() => {
        camPos(player.pos)
        if(player.pos.y >= fallDeath){
          go('lose', {score: scoreLabel.value})
        }
      })

      //  Entrar no cano
      player.collides('pipe',() => {
        keyPress('down', () => {
          go('game' , {
            level: (level + 1) % maps.length,
            score: scoreLabel.value
          })
        })
      })
    
      //  Movimento do inimigo
      action('dangerous', (d) => {
        d.move(-enemySpeed, 0)
      })

      //  Matar o bicho ou morrer.
      player.collides('dangerous',(d) => {
         if(isJumping){
          destroy(d)
         }else{
          go('lose', {score: scoreLabel.value})
         }
      })

      //  Mashroom se movendo 
      action('mushroom',(m) => {
        m.move(20, 0)
      })

      player.collides('mushroom',(m) => {
        destroy(m)
        player.biggify(6)
      })

      //  Pular e quebrar a caixa.
      player.on("headbump",(obj) => {
        if(obj.is('coin-surprise')){
          gameLevel.spawn('$', obj.gridPos.sub(0,1))
          destroy(obj)
          gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }

        if(obj.is('mushroom-surprise')){
          gameLevel.spawn('#', obj.gridPos.sub(0,1))
          destroy(obj)
          gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
      })

      //  Bater na caixa e aumentar o score.
      player.collides('coin',(c) => {
         destroy(c)
         scoreLabel.value++
         scoreLabel.text = scoreLabel.value
      })

      // Andar para esquerda
      keyDown("left", () => {
        player.move(-moveSpeed, 0);
      });
      //  Andar para direita
      keyDown("right", () => {
        player.move(moveSpeed, 0);
      });

      player.action(() => {
        if(player.grounded()){
          isJumping = false;
        }
      })

      //  Quando apertar o espaço o player pula
      keyPress("space", () => {
        if (player.grounded()) {
          isJumping = true;
          player.jump(currentJumpForce);
        }
      });

      //  Ato de morrer
      scene('lose', ({score}) => {
        add([text(score, 32), origin('center'), pos( width()/2, height()/2 ) ])
      })

    })

    start("game", {level: 0, score: 0})
  };

  startGame()
}
