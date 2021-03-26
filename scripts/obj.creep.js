require('creep.actions');

Creep.prototype.run = function() {
  var job = this.memory.role;
  this[job]();

  if (this.ticksToLive < 10 && this.memory.alive) {
    for (var j in this.room.memory.jobs) {
      if (j == job) {
        if (j == 'miner') {
          for (var s in this.room.memory.jobs[j].sources) {
            var source = this.room.memory.jobs[j].sources[s];
            if (this.memory.source == source.source) {
              source.cur--;
              console.log(`${this.name} has been removed from the ${j} list`);
              break;
            }
          }
        }
        else {
          this.room.memory.jobs[j].cur--;
          console.log(`${this.name} has been removed from the ${j} list`);
          break;
        }
      }
    }
    this.memory.alive = false;
    console.log(`${this.name} is about to die. Rest in Peace`);
  }

  if (Game.time % 10 == 0) {
    if (this.memory.isIdle) {
      // Check for job vacancies.
    }
  }
}

Creep.prototype.miner = function() {
  if (!this.memory.mining && this.store[RESOURCE_ENERGY] == 0) {
    this.memory.mining = true;
  }
  else if (this.memory.mining && this.store.getFreeCapacity() == 0) {
    this.memory.mining = false;
  }

  if (this.memory.mining) {
    var source = Game.getObjectById(this.memory.source);
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.moveTo(source, {visualizePathStyle : { stroke : '#ffaa00'}});
    }
  }
  else {
    var storages = this.getEnergyStores();
    if (storages.length > 0) {
      if (this.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(storages[0], {visualizePathStyle : { stroke : '#ffaa00'}});
      }
    }
    else {
      this.drop(RESOURCE_ENERGY);
    }
  }
  this.memory.isIdle = false;
}

Creep.prototype.upgrader = function() {
  if (this.store[RESOURCE_ENERGY] == 0) {
    if (!this.getEnergy()) {
      this.harvestEnergy();
    }
  }
  else {
    if (this.transfer(this.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller, {visualizePathStyle : { stroke : '#ffaa00'}});
    }
  }
  this.memory.isIdle = false;
}

Creep.prototype.builder = function() {
  if (this.store[RESOURCE_ENERGY] == 0) {
    if (!this.getEnergy()) {
      this.harvestEnergy();
    }
  }
  else {
    if (!this.buildSites()) {
      // REPAIR
    }
  }
  this.memory.isIdle = false;
}
