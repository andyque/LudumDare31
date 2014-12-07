/**
 * Created by guanghui on 12/6/14.
 */

MonsterType = {CAT : 1, MONKEY : 2, EAGLE : 3, HUMANBEING : 4}
MonsterState = {DANGEROUS : 0, FRIENDLY : 1}

var Monster = cc.Node.extend({
    sprite_ : null,
    type_: MonsterType.CAT,
    state_ : MonsterState.FRIENDLY,
    stateChangeDuration_: [5, 5, 5, 5],
    stateChangeInterval_: 0,
    spriteSize_ : null,
    winSize_ : null,
    textureName_ : "",
    initTextureName : function(){
        if(this.type_ == MonsterType.CAT){
            this.textureName_ = res.cat_png;
        }else if(this.type_ == MonsterType.EAGLE){
            this.textureName_ = res.eagle_png;
        }else if(this.type_ == MonsterType.MONKEY){
            this.textureName_ = res.monkey_png;
        }else if(this.type_ == MonsterType.HUMANBEING){
            this.textureName_ = res.human_png;
        }
    },
    ctor : function(type){
        this._super();
        this.type_ = type;

        this.initTextureName();

        this.sprite_ = new cc.Sprite(this.textureName_);
        this.addChild(this.sprite_);
        this.spriteSize_ = this.sprite_.getContentSize();
        this.winSize_ = cc.winSize;
        this.initPosition();
    },
    initPosition : function(){
        if(this.type_ == MonsterType.CAT){
            this.sprite_.setPosition(this.winSize_.width - this.spriteSize_.width/2, this.spriteSize_.height/2);
        }else if(this.type_ == MonsterType.MONKEY){
            this.sprite_.setPosition(this.spriteSize_.width/2, this.winSize_.height/2);
        }else if(this.type_ == MonsterType.EAGLE){
            this.sprite_.setPosition(this.winSize_.width/2, this.winSize_.height);

        }
    },

    getAttackArea : function(){
        if(this.type_ == MonsterType.CAT){
            return this.sprite_.getBoundingBox();
        }else if(this.type_ == MonsterType.MONKEY){
            return this.sprite_.getBoundingBox();
        }else if(this.type_ == MonsterType.EAGLE){
            return this.sprite_.getBoundingBox();
        }
    },

    switchStates : function()
    {
        this.state_ = (this.state_ == MonsterState.FRIENDLY) ? MonsterState.DANGEROUS : MonsterState.FRIENDLY;
    },

    update : function(dt)
    {
        this.stateChangeInterval_ += dt;
        if(this.stateChangeInterval_ >= this.stateChangeDuration_[this.type_ - 1 ])
        {
            this.stateChangeInterval_ = 0;
            this.switchStates();
        }

        this.walk();
    },

    getAttackDamage : function()
    {
      return 1;
    },

    walk : function(){
        var monsterPosition = this.sprite_.getPosition();
        if(this.type_ == MonsterType.CAT){
            var moveBy = cc.moveBy(3.3, cc.p(-1 * (this.winSize_.width - this.spriteSize_.width), 0));
            var reverseMoveby = moveBy.reverse();
            if(monsterPosition.x > this.winSize_.width/2){
                if(this.sprite_.getNumberOfRunningActions() == 0){
                    this.sprite_.setFlippedX(false);
                    this.sprite_.runAction(moveBy);
                }
            }else{
                if(this.sprite_.getNumberOfRunningActions() == 0){
                    this.sprite_.setFlippedX(true);
                    this.sprite_.runAction(reverseMoveby);
                }
            }

        }
    }
})