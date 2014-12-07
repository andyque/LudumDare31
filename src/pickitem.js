/**
 * Created by guanghui on 12/6/14.
 */

var ACTIVE_DURATION=3;
var INACTIVE_DURATION_MAX=16;
var INACTIVE_DURATION_MIN=5;
PickItemType = { RICE : 1, WORM : 2};

var PickItem = cc.Node.extend({
    sprite_ : null,
    active_ : true,
    activeInterval_ : 0,
    inativeInterval_ : 0,
    type_ : PickItemType.RICE,
    healValue_ : 1,
    ctor : function(dt){
        this._super();
        this.sprite_ = new cc.Sprite(res.item1_png);
        this.sprite_.setScale(0.6);
        this.sprite_.setPosition(cc.winSize.width/2, cc.winSize.height/1.5);
        this.addChild(this.sprite_);

        this.inActivate();
        this.inativeInterval_ = dt;

    },
    getHealValue : function(){
        return this.healValue_;
    },
    randomPosition : function(){
        var spriteContentSize = this.sprite_.getContentSize();
        var randomX = cc.random0To1() * (cc.winSize.width - spriteContentSize.width) + spriteContentSize.width/2;
        var randomY = cc.random0To1() * (cc.winSize.height - spriteContentSize.height - 20) + spriteContentSize.height/2 + 20;
        this.sprite_.setPosition(randomX, randomY);
    },
    update : function(dt){
       if(this.active_){
           this.activeInterval_ +=dt;
           if(this.activeInterval_ > ACTIVE_DURATION){
               if(this.type_ == PickItemType.RICE)  this.inActivate();
           }
       }else{
           this.inativeInterval_ += dt;
           var randomTime = (cc.random0To1() * (INACTIVE_DURATION_MAX - INACTIVE_DURATION_MIN)) + INACTIVE_DURATION_MIN;
           if(this.inativeInterval_ >= randomTime){
               this.randomPosition();
               this.activate();
           }
       }
    },

    inActivate : function(){
        this.active_ = false;
        this.setVisible(false);
        this.activeInterval_=0;
        this.inativeInterval_=0;
    },

    activate : function(){
        this.active_ = true;
        this.setVisible(true);
        this.activeInterval_=0;
        this.inativeInterval_=0;
    },

    isActive : function(){
        return this.active_;
    },

    getSprite : function(){
        return this.sprite_;
    }

});