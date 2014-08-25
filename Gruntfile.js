var tm = require('task-master');

module.exports = function(grunt) {
  tm(grunt);
  grunt.registerTask('default', ['jshint:all', 'mochaTest']);
}
