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
    ctor : function(){
        this._super();
        this.sprite_ = new cc.Sprite(res.monster1_png);
        this.addChild(this.sprite_);
        this.sprite_.setColor(cc.color(0,255,0,255));
    },

    getAttackArea : function()
    {
        return this.sprite_.getBoundingBox();
    },

    switchStates : function()
    {
        this.state_ = (this.state_ == MonsterState.FRIENDLY) ? MonsterState.DANGEROUS : MonsterState.FRIENDLY;
        this.sprite_.setColor((this.state_ == MonsterState.FRIENDLY) ? cc.color(0, 255, 0, 255) : cc.color(0, 255, 255, 255));
    },

    update : function(dt)
    {
        this.stateChangeInterval_ += dt;
        if(this.stateChangeInterval_ >= this.stateChangeDuration_[this.type_ - 1 ])
        {
            this.stateChangeInterval_ = 0;
            this.switchStates();
        }
    },

    getAttackDamage : function()
    {
      return 1;
    },

    emptyFunction : function(){

    }
})