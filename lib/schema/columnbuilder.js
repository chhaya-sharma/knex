'use strict';

exports.__esModule = true;
exports['default'] = ColumnBuilder;

var _lodash = require('lodash');

// The chainable interface off the original "column" method.

function ColumnBuilder(client, tableBuilder, type, args) {
  this.client = client;
  this._single = {};
  this._modifiers = {};
  this._statements = [];
  this._type = columnAlias[type] || type;
  this._args = args;
  this._tableBuilder = tableBuilder;

  // If we're altering the table, extend the object
  // with the available "alter" methods.
  if (tableBuilder._method === 'alter') {
    _lodash.extend(this, AlterMethods);
  }
}

// All of the modifier methods that can be used to modify the current query.
var modifiers = ['default', 'defaultsTo', 'defaultTo', 'unsigned', 'nullable', 'notNull', 'notNullable', 'first', 'after', 'comment', 'collate'];

// If we call any of the modifiers (index or otherwise) on the chainable, we pretend
// as though we're calling `table.method(column)` directly.
_lodash.each(modifiers, function (method) {
  ColumnBuilder.prototype[method] = function () {
    if (aliasMethod[method]) {
      method = aliasMethod[method];
    }
    if (method === 'notNullable') return this.nullable(false);
    this._modifiers[method] = _lodash.toArray(arguments);
    return this;
  };
});

_lodash.each(['index', 'primary', 'unique'], function (method) {
  ColumnBuilder.prototype[method] = function () {
    if (this._type.toLowerCase().indexOf('increments') === -1) {
      this._tableBuilder[method].apply(this._tableBuilder, [this._args[0]].concat(_lodash.toArray(arguments)));
    }
    return this;
  };
});

// Specify that the current column "references" a column,
// which may be tableName.column or just "column"
ColumnBuilder.prototype.references = function (value) {
  return this._tableBuilder.foreign.call(this._tableBuilder, this._args[0], this)._columnBuilder(this).references(value);
};

var AlterMethods = {};

// Specify that the column is to be dropped. This takes precedence
// over all other rules for the column.
AlterMethods.drop = function () {
  this._single.drop = true;
  return this;
};

// Specify the "type" that we're looking to set the
// Knex takes no responsibility for any data-loss that may
// occur when changing data types.
AlterMethods.alterType = function (type) {
  this._statements.push({
    grouping: 'alterType',
    value: type
  });
  return this;
};

// Aliases for convenience.
var aliasMethod = {
  'default': 'defaultTo',
  defaultsTo: 'defaultTo',
  notNull: 'notNullable'
};

// Alias a few methods for clarity when processing.
var columnAlias = {
  'float': 'floating',
  'enum': 'enu',
  'boolean': 'bool',
  'string': 'varchar',
  'bigint': 'bigInteger'
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvY29sdW1uYnVpbGRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBSXdCLGFBQWE7O3NCQUhDLFFBQVE7Ozs7QUFHL0IsU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3RFLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLE1BQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLE1BQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN2QyxNQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixNQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQzs7OztBQUlsQyxNQUFJLFlBQVksQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQ3BDLG1CQUFPLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztHQUM1QjtDQUNGOzs7QUFHRCxJQUFNLFNBQVMsR0FBRyxDQUNoQixTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQ2hELFVBQVUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUNwQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQ3ZDLENBQUM7Ozs7QUFJRixhQUFLLFNBQVMsRUFBRSxVQUFTLE1BQU0sRUFBRTtBQUMvQixlQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVc7QUFDM0MsUUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkIsWUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM5QjtBQUNELFFBQUksTUFBTSxLQUFLLGFBQWEsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsUUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxnQkFBUSxTQUFTLENBQUMsQ0FBQztBQUM3QyxXQUFPLElBQUksQ0FBQztHQUNiLENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsYUFBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLEVBQUUsVUFBUyxNQUFNLEVBQUU7QUFDcEQsZUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFXO0FBQzNDLFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFDakQsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFRLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQztBQUNELFdBQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQztDQUNILENBQUMsQ0FBQzs7OztBQUlILGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ25ELFNBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FDNUUsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUNwQixVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Q0FDdEIsQ0FBQzs7QUFFRixJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7QUFJeEIsWUFBWSxDQUFDLElBQUksR0FBRyxZQUFXO0FBQzdCLE1BQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN6QixTQUFPLElBQUksQ0FBQztDQUNiLENBQUM7Ozs7O0FBS0YsWUFBWSxDQUFDLFNBQVMsR0FBRyxVQUFTLElBQUksRUFBRTtBQUN0QyxNQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztBQUNwQixZQUFRLEVBQUUsV0FBVztBQUNyQixTQUFLLEVBQUUsSUFBSTtHQUNaLENBQUMsQ0FBQztBQUNILFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQzs7O0FBR0YsSUFBTSxXQUFXLEdBQUc7QUFDbEIsYUFBWSxXQUFXO0FBQ3ZCLFlBQVUsRUFBRSxXQUFXO0FBQ3ZCLFNBQU8sRUFBSyxhQUFhO0NBQzFCLENBQUM7OztBQUdGLElBQU0sV0FBVyxHQUFHO0FBQ2xCLFNBQU8sRUFBSSxVQUFVO0FBQ3JCLFFBQU0sRUFBSyxLQUFLO0FBQ2hCLFdBQVMsRUFBRSxNQUFNO0FBQ2pCLFVBQVEsRUFBRyxTQUFTO0FBQ3BCLFVBQVEsRUFBRyxZQUFZO0NBQ3hCLENBQUMiLCJmaWxlIjoiY29sdW1uYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgZXh0ZW5kLCBlYWNoLCB0b0FycmF5IH0gZnJvbSAnbG9kYXNoJ1xuXG4vLyBUaGUgY2hhaW5hYmxlIGludGVyZmFjZSBvZmYgdGhlIG9yaWdpbmFsIFwiY29sdW1uXCIgbWV0aG9kLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29sdW1uQnVpbGRlcihjbGllbnQsIHRhYmxlQnVpbGRlciwgdHlwZSwgYXJncykge1xuICB0aGlzLmNsaWVudCA9IGNsaWVudFxuICB0aGlzLl9zaW5nbGUgPSB7fTtcbiAgdGhpcy5fbW9kaWZpZXJzID0ge307XG4gIHRoaXMuX3N0YXRlbWVudHMgPSBbXTtcbiAgdGhpcy5fdHlwZSA9IGNvbHVtbkFsaWFzW3R5cGVdIHx8IHR5cGU7XG4gIHRoaXMuX2FyZ3MgPSBhcmdzO1xuICB0aGlzLl90YWJsZUJ1aWxkZXIgPSB0YWJsZUJ1aWxkZXI7XG5cbiAgLy8gSWYgd2UncmUgYWx0ZXJpbmcgdGhlIHRhYmxlLCBleHRlbmQgdGhlIG9iamVjdFxuICAvLyB3aXRoIHRoZSBhdmFpbGFibGUgXCJhbHRlclwiIG1ldGhvZHMuXG4gIGlmICh0YWJsZUJ1aWxkZXIuX21ldGhvZCA9PT0gJ2FsdGVyJykge1xuICAgIGV4dGVuZCh0aGlzLCBBbHRlck1ldGhvZHMpO1xuICB9XG59XG5cbi8vIEFsbCBvZiB0aGUgbW9kaWZpZXIgbWV0aG9kcyB0aGF0IGNhbiBiZSB1c2VkIHRvIG1vZGlmeSB0aGUgY3VycmVudCBxdWVyeS5cbmNvbnN0IG1vZGlmaWVycyA9IFtcbiAgJ2RlZmF1bHQnLCAnZGVmYXVsdHNUbycsICdkZWZhdWx0VG8nLCAndW5zaWduZWQnLFxuICAnbnVsbGFibGUnLCAnbm90TnVsbCcsICdub3ROdWxsYWJsZScsXG4gICdmaXJzdCcsICdhZnRlcicsICdjb21tZW50JywgJ2NvbGxhdGUnXG5dO1xuXG4vLyBJZiB3ZSBjYWxsIGFueSBvZiB0aGUgbW9kaWZpZXJzIChpbmRleCBvciBvdGhlcndpc2UpIG9uIHRoZSBjaGFpbmFibGUsIHdlIHByZXRlbmRcbi8vIGFzIHRob3VnaCB3ZSdyZSBjYWxsaW5nIGB0YWJsZS5tZXRob2QoY29sdW1uKWAgZGlyZWN0bHkuXG5lYWNoKG1vZGlmaWVycywgZnVuY3Rpb24obWV0aG9kKSB7XG4gIENvbHVtbkJ1aWxkZXIucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoYWxpYXNNZXRob2RbbWV0aG9kXSkge1xuICAgICAgbWV0aG9kID0gYWxpYXNNZXRob2RbbWV0aG9kXTtcbiAgICB9XG4gICAgaWYgKG1ldGhvZCA9PT0gJ25vdE51bGxhYmxlJykgcmV0dXJuIHRoaXMubnVsbGFibGUoZmFsc2UpO1xuICAgIHRoaXMuX21vZGlmaWVyc1ttZXRob2RdID0gdG9BcnJheShhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSk7XG5cbmVhY2goWydpbmRleCcsICdwcmltYXJ5JywgJ3VuaXF1ZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgQ29sdW1uQnVpbGRlci5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl90eXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaW5jcmVtZW50cycpID09PSAtMSkge1xuICAgICAgdGhpcy5fdGFibGVCdWlsZGVyW21ldGhvZF0uYXBwbHkodGhpcy5fdGFibGVCdWlsZGVyLFxuICAgICAgICBbdGhpcy5fYXJnc1swXV0uY29uY2F0KHRvQXJyYXkoYXJndW1lbnRzKSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pO1xuXG4vLyBTcGVjaWZ5IHRoYXQgdGhlIGN1cnJlbnQgY29sdW1uIFwicmVmZXJlbmNlc1wiIGEgY29sdW1uLFxuLy8gd2hpY2ggbWF5IGJlIHRhYmxlTmFtZS5jb2x1bW4gb3IganVzdCBcImNvbHVtblwiXG5Db2x1bW5CdWlsZGVyLnByb3RvdHlwZS5yZWZlcmVuY2VzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX3RhYmxlQnVpbGRlci5mb3JlaWduLmNhbGwodGhpcy5fdGFibGVCdWlsZGVyLCB0aGlzLl9hcmdzWzBdLCB0aGlzKVxuICAgIC5fY29sdW1uQnVpbGRlcih0aGlzKVxuICAgIC5yZWZlcmVuY2VzKHZhbHVlKTtcbn07XG5cbmNvbnN0IEFsdGVyTWV0aG9kcyA9IHt9O1xuXG4vLyBTcGVjaWZ5IHRoYXQgdGhlIGNvbHVtbiBpcyB0byBiZSBkcm9wcGVkLiBUaGlzIHRha2VzIHByZWNlZGVuY2Vcbi8vIG92ZXIgYWxsIG90aGVyIHJ1bGVzIGZvciB0aGUgY29sdW1uLlxuQWx0ZXJNZXRob2RzLmRyb3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2luZ2xlLmRyb3AgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFNwZWNpZnkgdGhlIFwidHlwZVwiIHRoYXQgd2UncmUgbG9va2luZyB0byBzZXQgdGhlXG4vLyBLbmV4IHRha2VzIG5vIHJlc3BvbnNpYmlsaXR5IGZvciBhbnkgZGF0YS1sb3NzIHRoYXQgbWF5XG4vLyBvY2N1ciB3aGVuIGNoYW5naW5nIGRhdGEgdHlwZXMuXG5BbHRlck1ldGhvZHMuYWx0ZXJUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICB0aGlzLl9zdGF0ZW1lbnRzLnB1c2goe1xuICAgIGdyb3VwaW5nOiAnYWx0ZXJUeXBlJyxcbiAgICB2YWx1ZTogdHlwZVxuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBBbGlhc2VzIGZvciBjb252ZW5pZW5jZS5cbmNvbnN0IGFsaWFzTWV0aG9kID0ge1xuICBkZWZhdWx0OiAgICAnZGVmYXVsdFRvJyxcbiAgZGVmYXVsdHNUbzogJ2RlZmF1bHRUbycsXG4gIG5vdE51bGw6ICAgICdub3ROdWxsYWJsZSdcbn07XG5cbi8vIEFsaWFzIGEgZmV3IG1ldGhvZHMgZm9yIGNsYXJpdHkgd2hlbiBwcm9jZXNzaW5nLlxuY29uc3QgY29sdW1uQWxpYXMgPSB7XG4gICdmbG9hdCcgIDogJ2Zsb2F0aW5nJyxcbiAgJ2VudW0nICAgOiAnZW51JyxcbiAgJ2Jvb2xlYW4nOiAnYm9vbCcsXG4gICdzdHJpbmcnIDogJ3ZhcmNoYXInLFxuICAnYmlnaW50JyA6ICdiaWdJbnRlZ2VyJ1xufTtcbiJdfQ==