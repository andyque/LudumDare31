/**
 * Created by guanghui on 12/7/14.
 */

Human = cc.Node.extend({
    sprite_ : null,
    spawnPosition_ : [ cc.p(40,40), cc.p(600,40)],
    spawnRate_ : 0,
    bulletsArray_ : [],
    ctor : function(){
        this._super();


    },
    addBullet : function(){

    },
    update : function(dt){
        this.spawnRate_ += dt;
        if(this.spawnRate_ > 3){

            this.spawnRate_ = 0;
        }
    }
});