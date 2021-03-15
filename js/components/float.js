/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('float', {
    depth: {type: WL.Type.Float, default: 0.01},
    speed: {type: WL.Type.Float, default: 2.0},
}, {

    start: function() {
        this.count = Math.random() * Math.PI * 2;                
    },
    update: function(dt) {              
        if(!this.orgPosition){
            this.orgPosition = [];
            this.object.getTranslationLocal(this.orgPosition);     
        };
        this.count += dt * this.speed;        
        if(this.count > Math.PI*2){
            this.count -= Math.PI*2;
        }        
        
        this.object.setTranslationLocal(
            [this.orgPosition[0],             
            this.orgPosition[1]+(Math.sin(this.count) * this.depth),
            this.orgPosition[2]]);
    },
});