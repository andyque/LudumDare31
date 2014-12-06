/**
 * Created by guanghui on 12/6/14.
 */

var FacingDirection = { FD_Left : 1, FD_Right : 2}
var HURTING_INTERVAL = 1;

var Bird = cc.Node.extend({
    sprite_ : null,
    facing_ : FacingDirection.FD_Right,
    isDead_ : false,
    px_ : 0,
    py_ : 0,
    accelerationY_ : 0,
    flyAnimation_ : null,
    blood_ : 100,
    isHurting_ : true,
    hurtTime_ : 0,
    ctor : function(){

        this._super();

        var winSize = cc.winSize;

        this.sprite_ = new cc.Sprite(res.bird_png);
        this.sprite_.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(this.sprite_);

        return true;
    },
    jump : function(){
        var jumpAction = new cc.JumpBy(1.0,this.sprite_.getPosition(),20,1);
        this.sprite_.runAction(jumpAction);
    },
    update : function(dt){
        if(this.isDead_){
            return;
        }

        if(!this.isHurting_){
            this.hurtTime_ += dt;
            if(this.hurtTime_ > HURTING_INTERVAL){
                this.isHurting_ = true;
                this.hurtTime_ = 0;
            }
        }

        this.py_ += this.accelerationY_ * dt;
        var pt = this.sprite_.getPosition();
        pt.x += this.px_ * dt;
        pt.y += this.py_ * dt;

        var halfHeight = this.sprite_.getContentSize().height/2;
        if(pt.y  <= halfHeight ){
            pt.y = halfHeight;
        }

        this.sprite_.setPosition(pt);
    },

    tap : function(){
        if(this.accelerationY_ == 0){
            this.accelerationY_ = -1333;
            this.px_ = 220;
        }

        this.py_ = 533.0;
    },

    collideWithWall : function(){
        //todo add audio
    },

    flipVelocityX : function(){
        this.px_ *= -1;
        if(this.facing_ == FacingDirection.FD_Right){
            this.sprite_.setFlippedX(false);
        }else{
            this.sprite_.setFlippedX(true);
        }
    },

    changeFacing : function(){
        if(this.facing_ == FacingDirection.FD_Left){
            this.facing_ = FacingDirection.FD_Right;
        }else{
            this.facing_ = FacingDirection.FD_Left;
        }
        this.flipVelocityX();
    },

    die : function(){
        this.isDead_ = true;
    },

    hurt : function(factor){
        if(this.isHurting_){
            this.blood_ = this.blood_ - factor;
            this.isHurting_ = false;
            cc.log("hurt")
            if(this.blood_ <= 0){
                this.die();
            }
        }

    },

    reset : function(){
        this.isDead_ = false;
        this.px_ = 0;
        this.py_ = 0;
        this.accelerationY_ = 0;
        this.facing_ = FacingDirection.FD_Right;
        this.sprite_.setFlippedX(false);
    },
    getSprite : function(){
        return this.sprite_;
    },

    playAnimation : function(){
        //todo
    },

    getVelocityX : function(){
      return this.px_;
    },

    setVelocity : function(vx){
        this.px_ = vx;
    },
})