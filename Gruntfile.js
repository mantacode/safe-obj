var tm = require('task-master');

module.exports = function(grunt) {
  tm(grunt);
  grunt.registerTask('default', ['jshint:all', 'mochaTest']);
  grunt.registerTask('coverage', ['mochacov:local']);
  grunt.registerTask('travis', ['jshint:all', 'mochaTest', 'mochacov:travis']);
}
