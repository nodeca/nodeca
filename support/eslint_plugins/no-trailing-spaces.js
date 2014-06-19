/**
 * @fileoverview Rule to flag trailing spaces
 * @author Nodeca Team <https://github.com/nodeca>
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var TRAILER_RE = /([\t \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+)\r?\n/g;


module.exports = function(context) {

  return {
    'Program': function detectAsyncAlias(node) {

      var src = context.getSource(node, node.range[0]);

      src.replace(TRAILER_RE, function(match, p, offset, orig) {
        var lines,
            location = {};

        lines = orig.slice(0, offset).split(/\r?\n/g);

        location.line = lines.length;
        location.column = lines[lines.length - 1].length + 1;

        context.report(node, location, 'Trailing spaces not allowed.');
      });
    }
  };
};
