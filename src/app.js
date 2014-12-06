
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var sprite = new cc.Sprite(res.HelloWorld_png)
        sprite.setPosition(200,200)
        sprite.setScale(0.3)
        this.addChild(sprite)


        var label = new cc.LabelTTF("Hello","Arial",20)
        label.setPosition(100,10)
        this.addChild(label)


        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

