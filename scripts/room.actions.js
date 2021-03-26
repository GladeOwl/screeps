Room.prototype.getSpawns = function() {
  var spawns = this.find(FIND_STRUCTURES, {
    filter : (structure) => {
      return (structure.structureType == STRUCTURE_SPAWN);
    }
  });
  return spawns;
}

Room.prototype.getContainers = function() {
  var containers = this.find(FIND_STRUCTURES, {
    filter : (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER) &&
      structure.store[RESOURCE_ENERGY] != 0;
    }
  });
  return containers;
}

Room.prototype.visualize = function(message, point, size) {
  this.visual.text(message, point.pos.x + 1, point.pos.y,
    {align : 'left', opacity: 0.5, font : size});
}

Room.prototype.roomData = function(message) {
  var point = new RoomPosition(49,49, this.name);
  for (var m in message) {
    this.visual.text(message[m], point.x, point.y - m,
      {align : 'right', opacity: 0.5, font : 0.5});
  }
}

Room.prototype.getSites = function() {
  return this.find(FIND_CONSTRUCTION_SITES);
}

Room.prototype.isAtSite = function(pos) {
  var sites = this.find(FIND_CONSTRUCTION_SITES);
  for (var s in sites) {
    var site = sites[s];
    if (site.pos == pos) {
      return true;
    }
  }
  return false;
}

Room.prototype.getTerrainAroundPoint = function(terrain, pos, range) {
  var sites = []
  for (x = -1; x < 2; x++) {
    for (y = -1; y < 2; y++) {
      var spot = terrain.get(pos.x + (x * range), pos.y + (y * range));
      if (spot != TERRAIN_MASK_WALL) {
        var newPos = new RoomPosition(pos.x + (x * range), pos.y + (y * range), this.name);
        sites.push(newPos);
        console.log(`sourcePos: ${pos}, adjacentPos : ${newPos}`);
      }
    }
  }
  return sites;
}

Room.prototype.getTerrainAtPoint = function(terrain, pos) {
  // const terrain = Game.map.getRoomTerrain(this.name);
  var point = terrain.get(pos.x + x * range, pos.y + y * range);
  return point;
}

Room.prototype.updateJobCount = function() {
  var changes = 0;
  for (var j in this.memory.jobs) {
    var job = this.memory.jobs[j];
    var cur = 0;
    for (var c in Game.creeps) {
      var creep = Game.creeps[c];
      if (creep.pos.roomName == this.name) {
        if (creep.memory.role == job.role) {
          c++;
          // console.log(`${creep.name} is a ${job.role}`);
        }
      }
    }
    this.memory.jobs[j].cur = cur;
    console.log(this.memory.jobs[j].cur);
  }
}

Room.prototype.scanPotentialSites = function() {
  const terrain = Game.map.getRoomTerrain(this.name);
  const level = this.controller.level;
  const spawns = this.getSpawns();
  const sources = this.find(FIND_SOURCES);
}
