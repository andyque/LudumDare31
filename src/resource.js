var res = {
    background_png : "res/images/background.png",
    foreground_png : "res/images/foreground.png",
    bird_png : "res/images/bird11.png",
    item1_png : "res/images/rice.png",
    item2_png : "res/images/worm.png",
    cat_png : "res/images/cat1.png",
    stab_png : "res/images/down_dents.png",
    eagle1_png : "res/images/eagle1.png",
    eagle2_png : "res/images/eagle2.png",
    human_png : "res/images/human.png",
    monkey_png : "res/images/monkey.png",
    bg_ogg : "res/audio/background.ogg",
    eagle_ogg : "res/audio/eagle.ogg",
    jump_ogg : "res/audio/Jump.ogg",
    die_ogg : "res/audio/die.ogg",
    pickcoin_ogg : "res/audio/pickCoin.ogg"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}