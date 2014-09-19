module.exports = {
  options: {
    targets: {
      test: '{{ version }}',
      when: 'v0.10',
      tasks: ['mochacov:lcov', 'matrix:v01.0']
    }
  }
};
