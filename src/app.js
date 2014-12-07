
var HelloWorldLayer = cc.Layer.extend({
    bird_ : null,
//    stabs_ : [],
    pickItems_: [],
    gameTime_ : 0,
    gameTimeLabel_ : null,
    isGameStart_ : false,
    lifeSpriteArray_ : [],
    monsters_ : [],
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
            var lifeSprite = new cc.Sprite(res.item1_png);
            var lifeSpriteSize = lifeSprite.getContentSize();
            var step = lifeSpriteSize.width * 0.2 + 2;
            lifeSprite.setScale(0.4);
            lifeSprite.setPosition(startPosition.x + i * step, startPosition.y);
            this.addChild(lifeSprite);
            lifeSprite.setVisible(false);

            this.lifeSpriteArray_.push(lifeSprite);

        }

        //display bird life
        var birdLife = this.bird_.blood_;
        for(var i = 0; i < birdLife; ++i){
            var lifeSprite = this.lifeSpriteArray_[i];
            lifeSprite.setVisible(true);
        }

    },
    initGame : function(){
        var visibleRect = cc.visibleRect;

        var bgSprite = new cc.Sprite(res.background_png);
        bgSprite.setPosition(visibleRect.width/2, visibleRect.height/2);
        this.addChild(bgSprite);

//        //todo: add all stabs
//        var stab = new Stab();
//        this.addChild(stab);
//
//        this.stabs_.push(stab);

        //add pickItem
        var pickItemCount = 5;
        for(var i = 0; i < pickItemCount; ++i ){
            var pickItem = new PickItem(i);
            this.addChild(pickItem);
            this.pickItems_.push(pickItem);
        }

        var pickItem = new PickItem(0);
        this.addChild(pickItem);
        pickItem.type_ = PickItemType.WORM;
        pickItem.getSprite().setColor(cc.color(255,0,0,255));
        this.pickItems_.push(pickItem);

        this.bird_ = new Bird();
        this.addChild(this.bird_);

        //create monsters
        var monster = new Monster();
        this.addChild(monster);
        this.monsters_.push(monster);

        //create HUD
        this.initHUD();

        this.addTouchHandling();
    },
    addTouchHandling : function(){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: null,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchBegan : function(touch, event){
        return true;
    },
    onTouchEnded : function(touch, event){
        var target = event.getCurrentTarget();

        target.bird_.tap();
        target.isGameStart_ = true;
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
                    //32 is space key
                    if(key == 32){
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

        var birdBoundingBox = this.bird_.getSprite().getBoundingBox();


//        //check bird and stab collision
//        for (var i = 0; i < this.stabs_.length; ++i){
//            var stab = this.stabs_[i];
//            var stabBoundingBox = stab.getBoundingBox();
//            if(cc.rectIntersectsRect(stabBoundingBox,birdBoundingBox)){
//                this.bird_.hurt(1.0);
//            }
//
//        }

        //check bird and pickItem collision
        for(var i = 0; i < this.pickItems_.length; ++i){
            var item = this.pickItems_[i];
            var itemBB = item.getSprite().getBoundingBox();
            if(item.isActive() &&cc.rectIntersectsRect(itemBB,birdBoundingBox)){
                if(item.type_ == PickItemType.RICE){
                    this.bird_.heal(item.getHealValue());
                }else if(item.type_ == PickItemType.WORM){
                    this.bird_.powerup();
                }
                item.inActivate();
            }
        }

        //check bird and monster collision
        for(var i = 0; i < this.monsters_.length; ++i)
        {
            var monster = this.monsters_[i];
            var monsterBB = monster.getAttackArea();
            if(cc.rectIntersectsRect(monsterBB, birdBoundingBox) && monster.state_ == MonsterState.DANGEROUS)
            {
                this.bird_.hurt(monster.getAttackDamage());
            }
        }

    },
    updateTimerHUD : function(dt){
        this.gameTime_ += dt;

        this.gameTimeLabel_.setString(Math.round(this.gameTime_));
    },
    updateHUD : function(dt){
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

    updateMonster : function(dt){
        for(var i = 0; i < this.monsters_.length; ++i){
            this.monsters_[i].update(dt);
        }
    },

    update : function(dt){
        this.updateHUD(dt);

        this.updateMonster(dt);


        if(!this.isGameStart_){
            return;
        }


        if(this.bird_.isDead_){
            cc.log("game over");
            return;
        }

        this.updateTimerHUD(dt);


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

