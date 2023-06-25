
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 570;

c.fillRect(0,0,canvas.width,canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position:{
        x : 0,
        y : 0
    },

    imageSrc: 'background.png',
    scale: 1
})

const shop = new Sprite({
    position:{
        x : 625,
        y : 128
    },

    imageSrc: 'shop.png',
    scale: 2.75,
    framesMax : 6

})


const player = new Fighter({
    
    position: {
        x : 0,
        y : 0
    },

    velocity: {
        x : 0,
        y : 0
    },

    offset: {
        x: 0,
        y: 0,
    },

    imageSrc: 'Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset : {
        x : 215,
        y : 157
    },

    sprites: {
        idle:{
            imageSrc: 'Idle.png',
            framesMax: 8,
        },

        run:{
            imageSrc: 'Run.png',
            framesMax: 8,
        },

        jump:{
            imageSrc: 'Jump.png',
            framesMax: 2,
        },

        fall:{
            imageSrc: 'fall.png',
            framesMax: 2
        },

        Attack1:{
            imageSrc: 'Attack1.png',
            framesMax: 6
        },
        
        takeHit: {
            imageSrc: 'Takehit.png',
            framesMax: 4

        }

    },

    attackBox: {
        offset : {
            x:0,
            y:0
        },

        width: 100,
        height: 50
    }

})


const enemy = new Fighter({
    
    position:{
        x: 400,
        y: 100
    },

    velocity:{
        x : 0,
        y : 0   
    },

    offset:{
        x: -50,
        y: 0
    },


    imageSrc: 'akiraIdle.png',
    scale: 2.5,
    framesMax: 4,
    offset : {
        x : 215,
        y : 167
    },

    sprites: {
        idle:{
            imageSrc: 'akiraIdle.png',
            framesMax: 4,
        },

        run:{
            imageSrc: 'akiraRun.png',
            framesMax: 8,
        },

        jump:{
            imageSrc: 'akiraJump.png',
            framesMax: 2,
        },

        fall:{
            imageSrc: 'akiraFall.png',
            framesMax: 2
        },

        Attack1:{
            imageSrc: 'akiraAttack1.png',
            framesMax: 4
        }, 

        takeHit: {
            imageSrc: 'akiraTakehit.png',
            framesMax: 3

        }

    },

    attackBox: {
        offset : {
            x:0,
            y:0
        },
        
        width: 100,
        height: 50
    }
})

console.log(player);

const keys = {
    a : {
        pressed : false
    },

    d : {
        pressed : false
    },

    w : {
        pressed : false
    },

    ArrowLeft : {
        pressed : false
    },

    ArrowRight : {
        pressed : false
    },

    ArrowUp : {
        pressed : false
    }

}
let lastKey;

/*function rectangularCollison(Rectangle1,Rectangle2){

    return(Rectangle1.attackbox.position.x + Rectangle1.attackbox.width >= Rectangle2.position.x && 
            Rectangle1.attackbox.position.x <= Rectangle2.position.x + Rectangle2.width &&
            Rectangle1.attackbox.position.y + Rectangle1.attackbox.height >= Rectangle2.position.y &&
            Rectangle1.attackbox.position.y <= Rectangle2.position.y + Rectangle2.height);
}*/

function rectangularCollison({ Rectangle1, Rectangle2 }) {
    return (
      Rectangle1.attackbox.position.x + Rectangle1.attackbox.width >= Rectangle2.position.x &&
      Rectangle1.attackbox.position.x <= Rectangle2.position.x + Rectangle2.width &&
      Rectangle1.attackbox.position.y + Rectangle1.attackbox.height >= Rectangle2.position.y &&
      Rectangle1.attackbox.position.y <= Rectangle2.position.y + Rectangle2.height
    );
  }


function determineWinner(player,enemy,timerId){
    clearTimeout(timerId)
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie'
        document.querySelector('#displayText').style.display = 'flex';
    }
    else if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Kenji Wins';
        document.querySelector('#displayText').style.display = 'flex';
    }
    else{
        document.querySelector('#displayText').innerHTML = 'Akira Wins';
        document.querySelector('#displayText').style.display = 'flex';
    }

}

let timer=60;
let timerId
function decreaseTimer(){

    if(timer>0){
        timer --;
        document.querySelector('#timer').innerHTML = timer; 
        timerId = setTimeout(decreaseTimer,1000);
    }
    if(timer === 0){
        determineWinner(player,enemy,timerId);
        
    }
}

decreaseTimer();


function animate(){

    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
   
    background.update();
    shop.update();
    player.update();
    enemy.update();

    //making sure whenever we lift up on one of our keys, we stop//
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement//
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else{
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy movement//
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else{
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }
    else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //collision detection//
    if( rectangularCollison({
        Rectangle1:player,
        Rectangle2:enemy
    })&&
        player.isAttacking){
            player.isAttacking = false;
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%' ; 
            
    }

    if( rectangularCollison({
        Rectangle1:enemy,
        Rectangle2:player
    })&&
        enemy.isAttacking){
            enemy.isAttacking = false;
            player.health -=20;
            document.querySelector('#playerHealth').style.width = player.health + '%';
            console.log('hit');
    }

    if(enemy.health<=0 || player.health <=0){
        determineWinner(player,enemy,timerId);
    }

}

animate();


window.addEventListener('keydown', (event)=>{

    switch(event.key){

        case 'd' : 
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;

        case 'a' :
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        
        case 'w' :
            player.velocity.y = -20;
            break;
        
        case ' ':
            player.attack()
            break;


        case 'ArrowRight' : 
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;

        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        
        case 'ArrowUp' :
            enemy.velocity.y = -20;
            break;

        case 'ArrowDown' : 
            enemy.attack();
            break;
    }

} )

window.addEventListener('keyup', (event)=>{

    switch(event.key){

        case 'd' : 
            keys.d.pressed = false;
            break;

        case 'a' :
            keys.a.pressed = false;
            break;

        case 'w' :
            keys.w.pressed = false;
            break;

        case 'ArrowRight' : 
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false;
            break;
        
        case 'ArrowUp' :
            keys.ArrowUp.pressed = false;
            break;
    }

} )