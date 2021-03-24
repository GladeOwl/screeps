Creep.prototype.getEnergyStores = function() {
    var storages = this.room.find(FIND_STRUCTURES, {
      filter : (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    return storages;
}

Creep.prototype.isOnContainer = function() {
  var container = this.room.find(FIND_STRUCTURES, {
    filter : (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER) &&
      structure.pos == this.pos;
    }
  });
  return container;
}

Creep.prototype.checkForJobs = function() {

}

Creep.prototype.getBuildSites = function() {
  return this.room.find(FIND_CONSTRUCTION_SITES);
}

Creep.prototype.getEnergy = function() {
  var foundSomething = false;

  const drop = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
  if(drop) {
    if(this.pickup(drop) == ERR_NOT_IN_RANGE) {
      this.moveTo(drop);
      foundSomething = true;
    }
  }
  else {
    var storages = this.room.getContainers();
    if (storages.length > 0) {
      if (this.withdraw(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(storages[0]);
        foundSomething = true;
      }
    }
  }
  return foundSomething;
}

Creep.prototype.harvestEnergy = function() {
  var source = this.room.findClosestByRange(FIND_SOURCES);
  if (this.harvest(source) == ERR_NOT_IN_RANGE) {
    this.moveTo(source, {visualizePathStyle : { stroke : '#ffaa00'}});
  }
  return;
}