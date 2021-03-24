require('help');

Spawn.prototype.queue = function() {
  if (this.room.memory.queue.length == 0) return;

  if (this.spawning) {
    this.visualAid(this.spawning, `Spawning`);
    return;
  }

  var spawnee = this.room.memory.queue[0];

  var isSpawnable = this.spawnCreep(spawnee.body, spawnee.name, { memory : spawnee.memory }, { dryRun : true });
  if (isSpawnable == 0) { // TODO: Make this adapt to different isSpawnable errors
    this.spawnCreep(spawnee.body, spawnee.name, { memory : spawnee.memory });
    this.room.memory.queue.shift();
    console.log(`Spawning ${spawnee.name}`);
  }
  else {
    var error = getError(isSpawnable);
    this.visualAid(spawnee, `${error}`);
  }
}

function getError(isSpawnable) {
  var error;
  switch (isSpawnable) {
    case -1:
      error = `Not Owned`
      break;
    case -3:
      error = `Name Exists`
      break;
    case -4:
      error = `Spawn Busy`
      break;
    case -6:
      error = `Insufficient Energy`
      break;
    case -10:
      error = `Input Fucked`
      break;
    case -14:
      error = `RCL Too Low`
      break;
  }
  return error;
}

Spawn.prototype.visualAid = function(spawnee, status) {
  var message = [
    `Name : ${spawnee.name}`,
    `Body : ${spawnee.body}`,
    `Status : ${status}`,
  ]
  for (var m in message) {
    this.room.visual.text(message[m], this.pos.x + 1, this.pos.y - m,
      {align : 'left', opacity: 0.5, font : 0.5});
  }
}
