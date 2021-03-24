require('room.actions');

Room.prototype.init = function() {
  if (this.memory.init) return;
  this.memory.buildSites = [];

  var spawns = this.getSpawns();
  for (var x in spawns) {
    var spawn = spawns[x];
    var sites = this.getTerrainAroundPoint(spawn.pos, 2);
    for (var y in sites) {
      var site = sites[y];
      this.memory.buildSites.push({ pos : site , type : STRUCTURE_EXTENSION });
    }
  }

  this.memory.jobs = {
    miner : {
      type : 'Colonist',
      priority : 0,
      sources : []
    },
    upgrader : {
      type : 'Colonist',
      priority : 1,
      min : 2,
      max : 0,
      cur : 0
    },
    builder : {
      type : 'Colonist',
      priority : 2,
      min : 0,
      max : 0,
      cur : 0
    },
    runner : {
      type : 'Colonist',
      priority : 3,
      min : 0,
      max : 0,
      cur : 0
    }
  }

  var sources = this.find(FIND_SOURCES);
  for (var i = 0; i < sources.length; i++) {
    var source = sources[i];
    var sourcePos = source.pos;
    var sites = this.getTerrainAroundPoint(sourcePos, 1);

    this.memory.jobs.miner.sources.push({
      source : source.id,
      min : sites.length,
      max : sites.length,
      cur : 0,
    });

    for (var s in sites) {
      var site = sites[s];
      this.memory.buildSites.push({ pos : site , type : STRUCTURE_CONTAINER });
    }
  }

  console.log(`Init for Room ${this.name} has finished.
    \Found ${sources.length} sources.
    \Found ${spawns.length} spawns.`);

  this.memory.queue = [];
  this.memory.init = true;
}
