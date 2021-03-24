require('obj.creep');
require('obj.room');

module.exports.loop = function() {
  for (var r in Game.rooms) {
    var room = Game.rooms[r];
    room.scan();
  }

  for (var c in Game.creeps) {
    var creep = Game.creeps[c];
    creep.run();
  }

  for (var m in Memory.creeps) {
    if (!Game.creeps[m]) {
      delete Memory.creeps[m];
    }
  }
  
  /*
  for (var c in Game.creeps) {
    var creep = Game.creeps[c];
    creep.suicide();
  }
  */
}
