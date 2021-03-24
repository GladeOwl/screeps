require('obj.spawn');
require('room.init');
require('room.actions');

Room.prototype.scan = function() {
  if (!this.memory.init) this.init();

  for (var s in this.memory.buildSites) {
    var site = this.memory.buildSites[s];
    var existingSite = this.isAtSite(site.pos);
    if (existingSite) {
      console.log(`${site.pos} already has ${existingSite} in it's place.`);
      continue;
    }
    var reply = this.createConstructionSite(site.pos.x, site.pos.y, site.type );
    if (reply == 0) {
      this.memory.buildSites.splice(s, 1);
      // console.log(`Couldn't build ${site.type} because of ${reply}`);
    }
    // console.log(`${site.type} is queued to be built at (${site.pos.x},${site.pos.y}) in Room ${site.pos.roomName}`);
  }

  var getSites = this.find(FIND_CONSTRUCTION_SITES);
  if (getSites.length > 0) {
    this.memory.jobs['builder'].min = 2;
  }
  else {
    this.memory.jobs['builder'].min = 0;
  }

  var visualData = [];
  visualData.push(`Room Controller || lvl : ${this.controller.level} | cur : ${this.controller.progress} | nxt : ${this.controller.progressTotal}`);

  var newCreeps = false;

  for (var j in this.memory.jobs) {
    var job = this.memory.jobs[j];
    
    if (j == 'miner') {
      for (var m in job.sources) {
        var source = job.sources[m];
        visualData.push(`${j} [${job.priority}] || cur : ${source.cur} | min : ${source.min} | max : ${source.max}`);

        while (source.cur < source.min) {
          console.log(`SENT A MINER!`);
          this.queueCreep(this.getName(job.type), { type : job.type, role : j, source : source.source, alive : true });
          source.cur++;
          newCreeps = true;
        }
      }
    }
    else {
      visualData.push(`${j} [${job.priority}] || cur : ${job.cur} | min : ${job.min} | max : ${job.max}`);

      while (job.cur < job.min) {
        this.queueCreep(this.getName(job.type), { type : job.type , role : j, alive : true });
        job.cur++;
        newCreeps = true;
      }
    }
  }

  if (newCreeps) {
    var that = this;
    this.memory.queue = this.memory.queue.sort(function(a,b) {
      return that.memory.jobs[a.memory.role].priority - that.memory.jobs[b.memory.role].priority;
    });
  }

  visualData.push(`Spawn Queue : ${this.memory.queue.length}`);
  visualData.push(`Build Queue : ${this.memory.buildSites.length}`);
  this.roomData(visualData);

  if (this.memory.queue.length != 0) {
    var spawns = this.getSpawns();
    for (var s in spawns) {
      var spawn = spawns[s]
      spawn.queue();
    }
  }
}

Room.prototype.queueCreep = function(body, memory) {
  var creep = {
    body : this.getBody(),
    name : body,
    memory : memory
  }
  this.memory.queue.push(creep);

  console.log(`${creep.name} has been added to build queue.
                They are a ${creep.memory.role}.
                with the body : ${creep.body}`);
}

var names = [
  'Amelia',
  'Ava',
  'Freddie',
  'Eve',
  'Henry',
  'Ivy',
  'Leo',
  'Noah',
  'Teddy',
  'Arthur',
  'Elsie',
  'Florense',
  'Harper',
  'Isla',
  'Jacob',
  'Muhammad',
  'Oscar',
  'Theo',
  'Willow',
  'Connor',
  'Callum',
  'Kyle',
  'Joe',
  'Reece',
  'Rhys',
  'Charlie',
  'Damian',
  'Emma',
  'Olivia',
  'Joe',
  'William',
]

Room.prototype.getName = function(type) {
  return `${type} ${_.sample(names)} ${Math.floor(Math.random() * 100)}`
}

Room.prototype.getBody = function() {
  return [WORK, CARRY, MOVE];
}
