class Game
{
    constructor(){
        this.barrels = [];
        this.iceControllers = []
    }

    registerWater(waterLevel){
        this.waterLevel = waterLevel;
    }    
    /**
     * 
     * @param {WL.Object} barrel 
     */
    removeBarrel(barrel){
        this.barrels.splice(this.barrels.indexOf(barrel.objectId),1);
        this.iceControllers.forEach(i=>i.setBarrels(this.barrels.length));
        this.waterLevel.lower();
    }

    addBarrel(barrel){
        this.barrels.push(barrel.objectId);        
        this.waterLevel.rise();
        this.iceControllers.forEach(i=>i.setBarrels(this.barrels.length));
    }

    registerIce(iceController){
        this.iceControllers.push(iceController);
    }
    
    unregisterIce(iceController){
        this.iceControllers.splice(
            this.iceControllers.findIndex(d=>d._id === iceController._id), 1);        
    }
}

const game = new Game();