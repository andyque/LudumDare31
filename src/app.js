
var HelloWorldLayer = cc.Layer.extend({
    bird_ : null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var visibleRect = cc.visibleRect;


        var bgSprite = new cc.Sprite(res.background_png);
        bgSprite.setPosition(visibleRect.width/2, visibleRect.height/2);
        this.addChild(bgSprite);



        this.bird_ = new Bird();
        this.addChild(this.bird_);

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

        this.scheduleUpdate();


        return true;
    },

    checkBirdCollision : function(dt){
        var pos = this.bird_.getSprite().getPosition();
        var birdBounds = this.bird_.getSprite().getContentSize();
        var boundSize = cc.winSize;

        if(pos.x+birdBounds.width/2 > boundSize.width ||
            (pos.x - birdBounds.width/2 < 0)){
            this.bird_.changeFacing();
        }


    },

    update : function(dt){
        this.bird_.update(dt);
        this.checkBirdCollision(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

