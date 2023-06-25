class Sprite{

    constructor({position,imageSrc,scale,framesMax=1,offset={x : 0 ,y : 0} }){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHolde = 7
        this.offset = offset
    }

    draw(){
        c.drawImage(this.image,this.framesCurrent*(this.image.width/this.framesMax),0,this.image.width/this.framesMax,this.image.height,
            this.position.x-this.offset.x,this.position.y-this.offset.y,
            (this.image.width/this.framesMax)*this.scale,this.image.height*this.scale)
    }

    animateFrames(){
        this.framesElapsed++

        if(this.framesElapsed%this.framesHolde==0){

            if(this.framesCurrent< this.framesMax-1){
                this.framesCurrent++ 
            }
            else{
                this.framesCurrent = 0;

            }
        }

    }

    update(){
        this.draw()
        this.animateFrames();
        
    }

}

class Fighter extends Sprite{

    constructor({position,velocity,color = 'pink',imageSrc,scale,framesMax=1,offset={x : 0 ,y : 0},sprites, attackBox = {
        offset: {}, width : undefined , height : undefined
    }}){
        
        super({

            position,
            imageSrc,
            scale,
            framesMax,
            offset,
        
        })

        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;

        this.attackbox = {
            position: {
                x : this.position.x,
                y : this.position.y
            } ,
            
            width: attackBox.width,
            height: attackBox.height,

            offset: attackBox.offset,

            
        }

        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHolde = 7
        this.sprites = sprites

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    /*draw(){
        c.fillStyle = this.color;
        c.fillRect(this.position.x,this.position.y,this.width,150)

        if(this.isAttacking){
            c.fillStyle = 'blue';
            c.fillRect(this.attackbox.position.x,this.attackbox.position.y,this.attackbox.width,this.attackbox.height);
        }
    }*/

    update(){
        this.draw()
        this.animateFrames();
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
        this.attackbox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //making sure that the object falls and stops as soon as it makes contact with ground//
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 91){
            this.velocity.y=0;
            this.position.y = 330;
        }
        else{
            //providing downward acceleration only when the player has'nt reached the gorund//
            this.velocity.y += gravity;
        }


    }

    attack(){
        this.switchSprite('Attack1')
        this.isAttacking = true;

        setTimeout(() => {
            this.isAttacking =false;
        }, 100);
    }

    switchSprite(sprite){

        if(this.image === this.sprites.Attack1.image && this.framesCurrent < this.sprites.Attack1.framesMax - 1) return 
        
        
        switch(sprite){
            
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0;
                }
                break;
            
            case 'run' :
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0;
                }
                break;
            
            case 'jump' :
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0;
                }
                break;
            
            case 'fall' :
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0;
                }
                break;
            
            case 'Attack1' :
                if(this.image !== this.sprites.Attack1.image){
                    this.image = this.sprites.Attack1.image
                    this.framesMax = this.sprites.Attack1.framesMax
                    this.framesCurrent = 0;
                }
                break;
            
            case 'takeHit' :
                    if(this.image !== this.sprites.takeHit.image){
                        this.image = this.sprites.takeHit.image
                        this.framesMax = this.sprites.takeHit.framesMax
                        this.framesCurrent = 0;
                    }
                break;
        }
    }
}