// Seeder
// -------

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _promise = require('../promise');

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require('lodash');

// The new seeds we're performing, typically called from the `knex.seed`
// interface on the main `knex` object. Passes the `knex` instance performing
// the seeds.
function Seeder(knex) {
  this.knex = knex;
  this.config = this.setConfig(knex.client.config.seeds);
}

// Runs all seed files for the given environment.
Seeder.prototype.run = _promise2['default'].method(function (config) {
  this.config = this.setConfig(config);
  return this._seedData().bind(this).spread(function (all) {
    return this._runSeeds(all);
  });
});

// Creates a new seed file, with a given name.
Seeder.prototype.make = function (name, config) {
  this.config = this.setConfig(config);
  if (!name) _promise2['default'].rejected(new Error('A name must be specified for the generated seed'));
  return this._ensureFolder(config).bind(this).then(this._generateStubTemplate).then(this._writeNewSeed(name));
};

// Lists all available seed files as a sorted array.
Seeder.prototype._listAll = _promise2['default'].method(function (config) {
  this.config = this.setConfig(config);
  return _promise2['default'].promisify(_fs2['default'].readdir, { context: _fs2['default'] })(this._absoluteConfigDir()).bind(this).then(function (seeds) {
    return _lodash.filter(seeds, function (value) {
      var extension = _path2['default'].extname(value);
      return _lodash.includes(['.co', '.coffee', '.eg', '.iced', '.js', '.litcoffee', '.ls'], extension);
    }).sort();
  });
});

// Gets the seed file list from the specified seed directory.
Seeder.prototype._seedData = function () {
  return _promise2['default'].join(this._listAll());
};

// Ensures a folder for the seeds exist, dependent on the
// seed config settings.
Seeder.prototype._ensureFolder = function () {
  var dir = this._absoluteConfigDir();
  return _promise2['default'].promisify(_fs2['default'].stat, { context: _fs2['default'] })(dir)['catch'](function () {
    return _promise2['default'].promisify(_mkdirp2['default'])(dir);
  });
};

// Run seed files, in sequence.
Seeder.prototype._runSeeds = function (seeds) {
  return _promise2['default'].all(_lodash.map(seeds, _lodash.bind(this._validateSeedStructure, this))).bind(this).then(function (seeds) {
    return _promise2['default'].bind(this).then(function () {
      return this._waterfallBatch(seeds);
    });
  });
};

// Validates seed files by requiring and checking for a `seed` function.
Seeder.prototype._validateSeedStructure = function (name) {
  var seed = require(_path2['default'].join(this._absoluteConfigDir(), name));
  if (typeof seed.seed !== 'function') {
    throw new Error('Invalid seed file: ' + name + ' must have a seed function');
  }
  return name;
};

// Generates the stub template for the current seed file, returning a compiled template.
Seeder.prototype._generateStubTemplate = function () {
  var stubPath = this.config.stub || _path2['default'].join(__dirname, 'stub', this.config.extension + '.stub');
  return _promise2['default'].promisify(_fs2['default'].readFile, { context: _fs2['default'] })(stubPath).then(function (stub) {
    return _lodash.template(stub.toString(), { variable: 'd' });
  });
};

// Write a new seed to disk, using the config and generated filename,
// passing any `variables` given in the config to the template.
Seeder.prototype._writeNewSeed = function (name) {
  var config = this.config;

  var dir = this._absoluteConfigDir();
  return function (tmpl) {
    if (name[0] === '-') name = name.slice(1);
    var filename = name + '.' + config.extension;
    return _promise2['default'].promisify(_fs2['default'].writeFile, { context: _fs2['default'] })(_path2['default'].join(dir, filename), tmpl(config.variables || {}))['return'](_path2['default'].join(dir, filename));
  };
};

// Runs a batch of seed files.
Seeder.prototype._waterfallBatch = function (seeds) {
  var knex = this.knex;

  var seedDirectory = this._absoluteConfigDir();
  var current = _promise2['default'].bind({ failed: false, failedOn: 0 });
  var log = [];
  _lodash.each(seeds, function (seed) {
    var name = _path2['default'].join(seedDirectory, seed);
    seed = require(name);

    // Run each seed file.
    current = current.then(function () {
      return seed.seed(knex, _promise2['default']);
    }).then(function () {
      log.push(name);
    });
  });

  return current.thenReturn([log]);
};

Seeder.prototype._absoluteConfigDir = function () {
  return _path2['default'].resolve(process.cwd(), this.config.directory);
};

Seeder.prototype.setConfig = function (config) {
  return _lodash.extend({
    extension: 'js',
    directory: './seeds'
  }, this.config || {}, config);
};

exports['default'] = Seeder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDekQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsZUFBSyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUU7QUFDekIsUUFBTSxJQUFJLEdBQUcsa0JBQUssSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM1QyxRQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHckIsV0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksdUJBQVU7S0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDckUsU0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoQixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsU0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztDQUNsQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsWUFBVztBQUMvQyxTQUFPLGtCQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUMzRCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVMsTUFBTSxFQUFFO0FBQzVDLFNBQU8sZUFBTztBQUNaLGFBQVMsRUFBRSxJQUFJO0FBQ2YsYUFBUyxFQUFFLFNBQVM7R0FDckIsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztDQUMvQixDQUFDOztxQkFFYSxNQUFNIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU2VlZGVyXG4vLyAtLS0tLS0tXG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4uL3Byb21pc2UnO1xuaW1wb3J0IHsgZmlsdGVyLCBpbmNsdWRlcywgbWFwLCBiaW5kLCB0ZW1wbGF0ZSwgZWFjaCwgZXh0ZW5kIH0gZnJvbSAnbG9kYXNoJ1xuXG4vLyBUaGUgbmV3IHNlZWRzIHdlJ3JlIHBlcmZvcm1pbmcsIHR5cGljYWxseSBjYWxsZWQgZnJvbSB0aGUgYGtuZXguc2VlZGBcbi8vIGludGVyZmFjZSBvbiB0aGUgbWFpbiBga25leGAgb2JqZWN0LiBQYXNzZXMgdGhlIGBrbmV4YCBpbnN0YW5jZSBwZXJmb3JtaW5nXG4vLyB0aGUgc2VlZHMuXG5mdW5jdGlvbiBTZWVkZXIoa25leCkge1xuICB0aGlzLmtuZXggPSBrbmV4O1xuICB0aGlzLmNvbmZpZyA9IHRoaXMuc2V0Q29uZmlnKGtuZXguY2xpZW50LmNvbmZpZy5zZWVkcyk7XG59XG5cbi8vIFJ1bnMgYWxsIHNlZWQgZmlsZXMgZm9yIHRoZSBnaXZlbiBlbnZpcm9ubWVudC5cblNlZWRlci5wcm90b3R5cGUucnVuID0gUHJvbWlzZS5tZXRob2QoZnVuY3Rpb24oY29uZmlnKSB7XG4gIHRoaXMuY29uZmlnID0gdGhpcy5zZXRDb25maWcoY29uZmlnKTtcbiAgcmV0dXJuIHRoaXMuX3NlZWREYXRhKClcbiAgICAuYmluZCh0aGlzKVxuICAgIC5zcHJlYWQoZnVuY3Rpb24oYWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnVuU2VlZHMoYWxsKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBDcmVhdGVzIGEgbmV3IHNlZWQgZmlsZSwgd2l0aCBhIGdpdmVuIG5hbWUuXG5TZWVkZXIucHJvdG90eXBlLm1ha2UgPSBmdW5jdGlvbihuYW1lLCBjb25maWcpIHtcbiAgdGhpcy5jb25maWcgPSB0aGlzLnNldENvbmZpZyhjb25maWcpO1xuICBpZiAoIW5hbWUpIFByb21pc2UucmVqZWN0ZWQobmV3IEVycm9yKCdBIG5hbWUgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIHRoZSBnZW5lcmF0ZWQgc2VlZCcpKTtcbiAgcmV0dXJuIHRoaXMuX2Vuc3VyZUZvbGRlcihjb25maWcpXG4gICAgLmJpbmQodGhpcylcbiAgICAudGhlbih0aGlzLl9nZW5lcmF0ZVN0dWJUZW1wbGF0ZSlcbiAgICAudGhlbih0aGlzLl93cml0ZU5ld1NlZWQobmFtZSkpO1xufTtcblxuLy8gTGlzdHMgYWxsIGF2YWlsYWJsZSBzZWVkIGZpbGVzIGFzIGEgc29ydGVkIGFycmF5LlxuU2VlZGVyLnByb3RvdHlwZS5fbGlzdEFsbCA9IFByb21pc2UubWV0aG9kKGZ1bmN0aW9uKGNvbmZpZykge1xuICB0aGlzLmNvbmZpZyA9IHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XG4gIHJldHVybiBQcm9taXNlLnByb21pc2lmeShmcy5yZWFkZGlyLCB7Y29udGV4dDogZnN9KSh0aGlzLl9hYnNvbHV0ZUNvbmZpZ0RpcigpKVxuICAgIC5iaW5kKHRoaXMpXG4gICAgLnRoZW4oc2VlZHMgPT5cbiAgICAgIGZpbHRlcihzZWVkcywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGluY2x1ZGVzKFsnLmNvJywgJy5jb2ZmZWUnLCAnLmVnJywgJy5pY2VkJywgJy5qcycsICcubGl0Y29mZmVlJywgJy5scyddLCBleHRlbnNpb24pO1xuICAgICAgfSkuc29ydCgpXG4gICAgKTtcbn0pO1xuXG4vLyBHZXRzIHRoZSBzZWVkIGZpbGUgbGlzdCBmcm9tIHRoZSBzcGVjaWZpZWQgc2VlZCBkaXJlY3RvcnkuXG5TZWVkZXIucHJvdG90eXBlLl9zZWVkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gUHJvbWlzZS5qb2luKHRoaXMuX2xpc3RBbGwoKSk7XG59O1xuXG5cbi8vIEVuc3VyZXMgYSBmb2xkZXIgZm9yIHRoZSBzZWVkcyBleGlzdCwgZGVwZW5kZW50IG9uIHRoZVxuLy8gc2VlZCBjb25maWcgc2V0dGluZ3MuXG5TZWVkZXIucHJvdG90eXBlLl9lbnN1cmVGb2xkZXIgPSBmdW5jdGlvbigpIHtcbiAgY29uc3QgZGlyID0gdGhpcy5fYWJzb2x1dGVDb25maWdEaXIoKTtcbiAgcmV0dXJuIFByb21pc2UucHJvbWlzaWZ5KGZzLnN0YXQsIHtjb250ZXh0OiBmc30pKGRpcilcbiAgICAuY2F0Y2goKCkgPT4gUHJvbWlzZS5wcm9taXNpZnkobWtkaXJwKShkaXIpKTtcbn07XG5cbi8vIFJ1biBzZWVkIGZpbGVzLCBpbiBzZXF1ZW5jZS5cblNlZWRlci5wcm90b3R5cGUuX3J1blNlZWRzID0gZnVuY3Rpb24oc2VlZHMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKG1hcChzZWVkcywgYmluZCh0aGlzLl92YWxpZGF0ZVNlZWRTdHJ1Y3R1cmUsIHRoaXMpKSlcbiAgICAuYmluZCh0aGlzKVxuICAgIC50aGVuKGZ1bmN0aW9uKHNlZWRzKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5iaW5kKHRoaXMpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl93YXRlcmZhbGxCYXRjaChzZWVkcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLy8gVmFsaWRhdGVzIHNlZWQgZmlsZXMgYnkgcmVxdWlyaW5nIGFuZCBjaGVja2luZyBmb3IgYSBgc2VlZGAgZnVuY3Rpb24uXG5TZWVkZXIucHJvdG90eXBlLl92YWxpZGF0ZVNlZWRTdHJ1Y3R1cmUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGNvbnN0IHNlZWQgPSByZXF1aXJlKHBhdGguam9pbih0aGlzLl9hYnNvbHV0ZUNvbmZpZ0RpcigpLCBuYW1lKSk7XG4gIGlmICh0eXBlb2Ygc2VlZC5zZWVkICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNlZWQgZmlsZTogJHtuYW1lfSBtdXN0IGhhdmUgYSBzZWVkIGZ1bmN0aW9uYCk7XG4gIH1cbiAgcmV0dXJuIG5hbWU7XG59O1xuXG4vLyBHZW5lcmF0ZXMgdGhlIHN0dWIgdGVtcGxhdGUgZm9yIHRoZSBjdXJyZW50IHNlZWQgZmlsZSwgcmV0dXJuaW5nIGEgY29tcGlsZWQgdGVtcGxhdGUuXG5TZWVkZXIucHJvdG90eXBlLl9nZW5lcmF0ZVN0dWJUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zdCBzdHViUGF0aCA9IHRoaXMuY29uZmlnLnN0dWIgfHxcbiAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3R1YicsIHRoaXMuY29uZmlnLmV4dGVuc2lvbiArICcuc3R1YicpO1xuICByZXR1cm4gUHJvbWlzZS5wcm9taXNpZnkoZnMucmVhZEZpbGUsIHtjb250ZXh0OiBmc30pKHN0dWJQYXRoKS50aGVuKHN0dWIgPT5cbiAgICB0ZW1wbGF0ZShzdHViLnRvU3RyaW5nKCksIHt2YXJpYWJsZTogJ2QnfSlcbiAgKTtcbn07XG5cbi8vIFdyaXRlIGEgbmV3IHNlZWQgdG8gZGlzaywgdXNpbmcgdGhlIGNvbmZpZyBhbmQgZ2VuZXJhdGVkIGZpbGVuYW1lLFxuLy8gcGFzc2luZyBhbnkgYHZhcmlhYmxlc2AgZ2l2ZW4gaW4gdGhlIGNvbmZpZyB0byB0aGUgdGVtcGxhdGUuXG5TZWVkZXIucHJvdG90eXBlLl93cml0ZU5ld1NlZWQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGNvbnN0IHsgY29uZmlnIH0gPSB0aGlzO1xuICBjb25zdCBkaXIgPSB0aGlzLl9hYnNvbHV0ZUNvbmZpZ0RpcigpO1xuICByZXR1cm4gZnVuY3Rpb24odG1wbCkge1xuICAgIGlmIChuYW1lWzBdID09PSAnLScpIG5hbWUgPSBuYW1lLnNsaWNlKDEpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gbmFtZSArICcuJyArIGNvbmZpZy5leHRlbnNpb247XG4gICAgcmV0dXJuIFByb21pc2UucHJvbWlzaWZ5KGZzLndyaXRlRmlsZSwge2NvbnRleHQ6IGZzfSkoXG4gICAgICBwYXRoLmpvaW4oZGlyLCBmaWxlbmFtZSksXG4gICAgICB0bXBsKGNvbmZpZy52YXJpYWJsZXMgfHwge30pXG4gICAgKS5yZXR1cm4ocGF0aC5qb2luKGRpciwgZmlsZW5hbWUpKTtcbiAgfTtcbn07XG5cbi8vIFJ1bnMgYSBiYXRjaCBvZiBzZWVkIGZpbGVzLlxuU2VlZGVyLnByb3RvdHlwZS5fd2F0ZXJmYWxsQmF0Y2ggPSBmdW5jdGlvbihzZWVkcykge1xuICBjb25zdCB7IGtuZXggfSA9IHRoaXM7XG4gIGNvbnN0IHNlZWREaXJlY3RvcnkgPSB0aGlzLl9hYnNvbHV0ZUNvbmZpZ0RpcigpO1xuICBsZXQgY3VycmVudCA9IFByb21pc2UuYmluZCh7ZmFpbGVkOiBmYWxzZSwgZmFpbGVkT246IDB9KTtcbiAgY29uc3QgbG9nID0gW107XG4gIGVhY2goc2VlZHMsIGZ1bmN0aW9uKHNlZWQpIHtcbiAgICBjb25zdCBuYW1lID0gcGF0aC5qb2luKHNlZWREaXJlY3RvcnksIHNlZWQpO1xuICAgIHNlZWQgPSByZXF1aXJlKG5hbWUpO1xuXG4gICAgLy8gUnVuIGVhY2ggc2VlZCBmaWxlLlxuICAgIGN1cnJlbnQgPSBjdXJyZW50LnRoZW4oKCkgPT4gc2VlZC5zZWVkKGtuZXgsIFByb21pc2UpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgbG9nLnB1c2gobmFtZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjdXJyZW50LnRoZW5SZXR1cm4oW2xvZ10pO1xufTtcblxuU2VlZGVyLnByb3RvdHlwZS5fYWJzb2x1dGVDb25maWdEaXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCB0aGlzLmNvbmZpZy5kaXJlY3RvcnkpO1xufTtcblxuU2VlZGVyLnByb3RvdHlwZS5zZXRDb25maWcgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgcmV0dXJuIGV4dGVuZCh7XG4gICAgZXh0ZW5zaW9uOiAnanMnLFxuICAgIGRpcmVjdG9yeTogJy4vc2VlZHMnXG4gIH0sIHRoaXMuY29uZmlnIHx8IHt9LCBjb25maWcpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2VlZGVyO1xuIl19