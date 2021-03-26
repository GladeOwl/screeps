Creep.prototype.getEnergyStores = function() {
  return this.room.find(FIND_STRUCTURES, {
    filter : (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
}

Creep.prototype.isOnContainer = function() {
  return this.room.find(FIND_STRUCTURES, {
    filter : (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER) &&
      structure.pos == this.pos;
    }
  });
}

Creep.prototype.checkForJobs = function() {}

Creep.prototype.getBuildSites = function() {
  return this.room.find(FIND_CONSTRUCTION_SITES);
}

Creep.prototype.getEnergy = function() {
  if (this.getFromDropped()) return true;
  if (this.getFromContainer()) return true;
  return false;
}

Creep.prototype.getFromDropped = function() {
  const drop = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
  if (!drop) return false;
  if(this.pickup(drop) == ERR_NOT_IN_RANGE) {
    this.moveTo(drop);
  }
  return true;
}

Creep.prototype.getFromContainer = function() {
  var storages = this.room.getContainers();
  this.say(`L:Cont`)
  if (storages.length == 0) return false;
  if (this.withdraw(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    this.moveTo(storages[0]);
    foundSomething = true;
  }
  return true;
}

Creep.prototype.harvestEnergy = function() {
  var source = this.pos.findClosestByRange(FIND_SOURCES);
  if (this.harvest(source) == ERR_NOT_IN_RANGE) {
    this.moveTo(source, {visualizePathStyle : { stroke : '#ffaa00'}});
  }
  return;
}

Creep.prototype.buildSites = function() {
  var buildSite = this.room.getSites();
  if (buildSite.length == 0) return false;
  if (this.build(buildSite[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    this.moveTo(buildSite[0], {visualizePathStyle : { stroke : '#ffaa00'}});
  }
  return true;
}

Creep.prototype.repairStructures = function() {
  return this.room.find(FIND_STRUCTURES, {
    filter : (structure) => {
      return (structure.structureType != STRUCTURE_WALL) &&
              structure.hits < structure.hitsMax;
    }
  });
}