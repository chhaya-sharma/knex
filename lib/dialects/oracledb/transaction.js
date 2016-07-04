'use strict';

var _lodash = require('lodash');

var inherits = require('inherits');
var Promise = require('../../promise');
var Transaction = require('../../transaction');
var debugTx = require('debug')('knex:tx');

function Oracle_Transaction(client, container, config, outerTx) {
  Transaction.call(this, client, container, config, outerTx);
}
inherits(Oracle_Transaction, Transaction);

_lodash.assign(Oracle_Transaction.prototype, {
  // disable autocommit to allow correct behavior (default is true)
  begin: function begin() {
    return Promise.resolve();
  },
  commit: function commit(conn, value) {
    this._completed = true;
    return conn.commitAsync()['return'](value).then(this._resolver, this._rejecter);
  },
  release: function release(conn, value) {
    return this._resolver(value);
  },
  rollback: function rollback(conn, err) {
    var self = this;
    this._completed = true;
    debugTx('%s: rolling back', this.txid);
    return conn.rollbackAsync().timeout(5000)['catch'](Promise.TimeoutError, function (e) {
      self._rejecter(e);
    }).then(function () {
      self._rejecter(err);
    });
  },
  acquireConnection: function acquireConnection(config) {
    var t = this;
    return Promise['try'](function () {
      return t.client.acquireConnection().completed.then(function (cnx) {
        cnx.isTransaction = true;
        return cnx;
      });
    }).disposer(function (connection) {
      debugTx('%s: releasing connection', t.txid);
      connection.isTransaction = false;
      connection.commitAsync().then(function (err) {
        if (err) {
          this._rejecter(err);
        }
        if (!config.connection) {
          t.client.releaseConnection(connection);
        } else {
          debugTx('%s: not releasing external connection', t.txid);
        }
      });
    });
  }
});

module.exports = Oracle_Transaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kaWFsZWN0cy9vcmFjbGVkYi90cmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztzQkFLQSxRQUFROztBQUxSLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekMsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUk1QyxTQUFTLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUM5RCxhQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztDQUM1RDtBQUNELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFMUMsZUFBTyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7O0FBRW5DLE9BQUssRUFBRSxpQkFBVztBQUNoQixXQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUMxQjtBQUNELFFBQU0sRUFBRSxnQkFBUyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzVCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFdBQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUNoQixDQUFDLEtBQUssQ0FBQyxDQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN6QztBQUNELFNBQU8sRUFBRSxpQkFBUyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzdCLFdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUM5QjtBQUNELFVBQVEsRUFBRSxrQkFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQzVCLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixXQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFdBQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDaEYsVUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDakIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQixDQUFDLENBQUM7R0FDSjtBQUNELG1CQUFpQixFQUFFLDJCQUFTLE1BQU0sRUFBRTtBQUNsQyxRQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZixXQUFPLE9BQU8sT0FBSSxDQUFDLFlBQVc7QUFDNUIsYUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFTLEdBQUcsRUFBRTtBQUMvRCxXQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUN6QixlQUFPLEdBQUcsQ0FBQztPQUNaLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBUyxVQUFVLEVBQUU7QUFDL0IsYUFBTyxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxnQkFBVSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDakMsZ0JBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FDckIsSUFBSSxDQUFDLFVBQVMsR0FBRyxFQUFFO0FBQ2xCLFlBQUksR0FBRyxFQUFFO0FBQ1AsY0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjtBQUNELFlBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3RCLFdBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDeEMsTUFBTTtBQUNMLGlCQUFPLENBQUMsdUNBQXVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFEO09BQ0YsQ0FBQyxDQUFDO0tBQ04sQ0FBQyxDQUFDO0dBQ0o7Q0FDRixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJ0cmFuc2FjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCcuLi8uLi9wcm9taXNlJyk7XG5jb25zdCBUcmFuc2FjdGlvbiA9IHJlcXVpcmUoJy4uLy4uL3RyYW5zYWN0aW9uJyk7XG5jb25zdCBkZWJ1Z1R4ID0gcmVxdWlyZSgnZGVidWcnKSgna25leDp0eCcpO1xuaW1wb3J0IHthc3NpZ259IGZyb21cbidsb2Rhc2gnXG5cbmZ1bmN0aW9uIE9yYWNsZV9UcmFuc2FjdGlvbihjbGllbnQsIGNvbnRhaW5lciwgY29uZmlnLCBvdXRlclR4KSB7XG4gIFRyYW5zYWN0aW9uLmNhbGwodGhpcywgY2xpZW50LCBjb250YWluZXIsIGNvbmZpZywgb3V0ZXJUeCk7XG59XG5pbmhlcml0cyhPcmFjbGVfVHJhbnNhY3Rpb24sIFRyYW5zYWN0aW9uKTtcblxuYXNzaWduKE9yYWNsZV9UcmFuc2FjdGlvbi5wcm90b3R5cGUsIHtcbiAgLy8gZGlzYWJsZSBhdXRvY29tbWl0IHRvIGFsbG93IGNvcnJlY3QgYmVoYXZpb3IgKGRlZmF1bHQgaXMgdHJ1ZSlcbiAgYmVnaW46IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSxcbiAgY29tbWl0OiBmdW5jdGlvbihjb25uLCB2YWx1ZSkge1xuICAgIHRoaXMuX2NvbXBsZXRlZCA9IHRydWU7XG4gICAgcmV0dXJuIGNvbm4uY29tbWl0QXN5bmMoKVxuICAgICAgLnJldHVybih2YWx1ZSlcbiAgICAgIC50aGVuKHRoaXMuX3Jlc29sdmVyLCB0aGlzLl9yZWplY3Rlcik7XG4gIH0sXG4gIHJlbGVhc2U6IGZ1bmN0aW9uKGNvbm4sIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVyKHZhbHVlKTtcbiAgfSxcbiAgcm9sbGJhY2s6IGZ1bmN0aW9uKGNvbm4sIGVycikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX2NvbXBsZXRlZCA9IHRydWU7XG4gICAgZGVidWdUeCgnJXM6IHJvbGxpbmcgYmFjaycsIHRoaXMudHhpZCk7XG4gICAgcmV0dXJuIGNvbm4ucm9sbGJhY2tBc3luYygpLnRpbWVvdXQoNTAwMCkuY2F0Y2goUHJvbWlzZS5UaW1lb3V0RXJyb3IsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNlbGYuX3JlamVjdGVyKGUpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9yZWplY3RlcihlcnIpO1xuICAgIH0pO1xuICB9LFxuICBhY3F1aXJlQ29ubmVjdGlvbjogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgY29uc3QgdCA9IHRoaXM7XG4gICAgcmV0dXJuIFByb21pc2UudHJ5KGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHQuY2xpZW50LmFjcXVpcmVDb25uZWN0aW9uKCkuY29tcGxldGVkLnRoZW4oZnVuY3Rpb24oY254KSB7XG4gICAgICAgIGNueC5pc1RyYW5zYWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGNueDtcbiAgICAgIH0pO1xuICAgIH0pLmRpc3Bvc2VyKGZ1bmN0aW9uKGNvbm5lY3Rpb24pIHtcbiAgICAgIGRlYnVnVHgoJyVzOiByZWxlYXNpbmcgY29ubmVjdGlvbicsIHQudHhpZCk7XG4gICAgICBjb25uZWN0aW9uLmlzVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgICAgIGNvbm5lY3Rpb24uY29tbWl0QXN5bmMoKVxuICAgICAgICAudGhlbihmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWplY3RlcihlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWNvbmZpZy5jb25uZWN0aW9uKSB7XG4gICAgICAgICAgICB0LmNsaWVudC5yZWxlYXNlQ29ubmVjdGlvbihjb25uZWN0aW9uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVidWdUeCgnJXM6IG5vdCByZWxlYXNpbmcgZXh0ZXJuYWwgY29ubmVjdGlvbicsIHQudHhpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gT3JhY2xlX1RyYW5zYWN0aW9uO1xuIl19