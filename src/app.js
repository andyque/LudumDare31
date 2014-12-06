
var HelloWorldLayer = cc.Layer.extend({
    bird_ : null,
    stabs_ : [],
    pickItems_: [],
    gameTime_ : 0,
    gameTimeLabel_ : null,
    isGameStart_ : false,
    lifeSpriteArray_ : [],
    initHUD : function(){
        var winSize = cc.winSize;


        this.gameTimeLabel_ = new cc.LabelTTF("0","Arial",20);
        var labelSize = this.gameTimeLabel_.getContentSize();
        var gameTimeLabelPosition = new cc.Point(winSize.width - labelSize.width * 2,
            winSize.height - labelSize.height/2);
        this.gameTimeLabel_.setPosition(gameTimeLabelPosition.x, gameTimeLabelPosition.y);
        this.addChild(this.gameTimeLabel_);


        var timeIndicatorLabel = new cc.LabelTTF("Time:", "Arial",20);
        var timeIndicatorLabelSize = timeIndicatorLabel.getContentSize();
        timeIndicatorLabel.setPosition(gameTimeLabelPosition.x - timeIndicatorLabelSize.width/2 - 20, gameTimeLabelPosition.y);
        this.addChild(timeIndicatorLabel);

        var birdHealthLabel = new cc.LabelTTF("Life:", "Arial", 20);
        var healthLabelSize = birdHealthLabel.getContentSize();
        birdHealthLabel.setPosition(healthLabelSize.width/2 + 5, winSize.height - healthLabelSize.height/2 - 5);
        this.addChild(birdHealthLabel);

        var startPosition = new cc.Point(birdHealthLabel.getPosition().x + healthLabelSize.width/2 + 25,
                                birdHealthLabel.getPosition().y);
        for(var i = 0; i < 10; ++i){
            var lifeSprite = new cc.Sprite(res.bird_png);
            var lifeSpriteSize = lifeSprite.getContentSize();
            var step = lifeSpriteSize.width * 0.2 + 2;
            lifeSprite.setScale(0.2);
            lifeSprite.setPosition(startPosition.x + i * step, startPosition.y);
            this.addChild(lifeSprite);
            lifeSprite.setVisible(false);

            this.lifeSpriteArray_.push(lifeSprite);

        }

    },
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

        this.initHUD();
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
                        that.isGameStart_ = true;
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
    updateHUD : function(dt){
        this.gameTime_ += dt;

        this.gameTimeLabel_.setString(Math.round(this.gameTime_));

        for(var i = 0; i < 10; ++i){
            var lifeSprite = this.lifeSpriteArray_[i];
            lifeSprite.setVisible(false);
        }

        //display bird life
        var birdLife = this.bird_.blood_;
        for(var i = 0; i < birdLife; ++i){
            var lifeSprite = this.lifeSpriteArray_[i];
            lifeSprite.setVisible(true);
        }
    },

    update : function(dt){
        this.updateHUD(dt);

        if(!this.isGameStart_){
            return;
        }
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

