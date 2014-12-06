/**
 * Created by guanghui on 12/6/14.
 */

var PickItem = cc.Node.extend({
    sprite_ : null,
    active_ : true,
    ctor : function(){
        this._super();
        this.sprite_ = new cc.Sprite(res.item1_png);
        this.sprite_.setPosition(cc.winSize.width/2, cc.winSize.height/1.5);
        this.addChild(this.sprite_);
    },

    inActivate : function(){
        this.active_ = false;
        this.setVisible(false);
    },

    activate : function(){
        this.active_ = true;
        this.setVisible(true);
    },

    isActive : function(){
        return this.active_;
    },

    getSprite : function(){
        return this.sprite_;
    }

});