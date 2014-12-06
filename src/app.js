
var HelloWorldLayer = cc.Layer.extend({
    bird_ : null,
    stabs_ : [],
    pickItems_: [],
    initGame : function(){
        var visibleRect = cc.visibleRect;

        var bgSprite = new cc.Sprite(res.background_png);
        bgSprite.setPosition(visibleRect.width/2, visibleRect.height/2);
        this.addChild(bgSprite);

        //todo: add all stabs
        var stab = new Stab();
        stab.getSprite().setPosition(0,0);
        this.addChild(stab);

        this.stabs_.push(stab);

        //add pickItem
        var pickItemCount = 5;
        for(var i = 0; i < pickItemCount; ++i ){
            var pickItem = new PickItem(i);
            this.addChild(pickItem);
            this.pickItems_.push(pickItem);
        }


        this.bird_ = new Bird();
        this.addChild(this.bird_);
    },
    addKeyboard : function(){
        var that = this;
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
//                onKeyPressed:function(key, event) {
//                    cc.log("Key down:" + key);
//                },
                onKeyReleased:function(key, event) {
                    if(key == 32){
//                        cc.log("jump")
                        that.bird_.tap();
                    }
                }
            }, this);
        } else {
            cc.log("KEYBOARD Not supported");
        }
    },
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();


        this.initGame();

        this.addKeyboard();

        this.scheduleUpdate();


        return true;
    },

    checkBirdCollision : function(dt){
        var pos = this.bird_.getSprite().getPosition();
        var birdBounds = this.bird_.getSprite().getContentSize();
        var boundSize = cc.winSize;

        if(pos.x >= boundSize.width - birdBounds.width/2){
            this.bird_.changeFacing();
            this.bird_.getSprite().setPosition(boundSize.width - birdBounds.width/2, pos.y);
        }
        if(pos.x  <= birdBounds.width/2){
            this.bird_.changeFacing();
            this.bird_.getSprite().setPosition(birdBounds.width/2, pos.y);
        }

        //check bird and stab collision
        var birdBoundingBox = this.bird_.getSprite().getBoundingBox();
        for (var i = 0; i < this.stabs_.length; ++i){
            var stab = this.stabs_[i];
            var stabBoundingBox = stab.getBoundingBox();
            if(cc.rectIntersectsRect(stabBoundingBox,birdBoundingBox)){
                this.bird_.hurt(1.0);
            }

        }

        //check bird and pickItem collision
        for(var i = 0; i < this.pickItems_.length; ++i){
            var item = this.pickItems_[i];
            var itemBB = item.getSprite().getBoundingBox();
            if(item.isActive() &&cc.rectIntersectsRect(itemBB,birdBoundingBox)){
                this.bird_.heal(1.0);
                item.inActivate();
            }
        }


    },

    update : function(dt){
        if(this.bird_.isDead_){
            cc.log("game over");
            return;
        }
        for(var i = 0; i < this.pickItems_.length; ++i){
            this.pickItems_[i].update(dt);
        }

        this.checkBirdCollision(dt);

        this.bird_.update(dt);

    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

