/**
 * @fileoverview Rule to flag no EOL at the and of file and multiple EOLs at the end.
 * @author Nodeca Team <https://github.com/nodeca>
 */

'use strict';


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    'Program': function detectBadEOF(node) {

      // Last param is hack to be sure that we get all file content.
      var src = context.getSource(node, node.range[0], 1000000);
      var lines = src.split(/\r?\n/g);

      var location = {
        line:   lines.length,
        column: lines[lines.length - 1].length + 1
      };

      // Check that file is ended with EOL
      if (lines[lines.length - 1] !== '') {
        context.report(node, location, 'Unexpected end of file - newline needed.');

      } else if (lines[lines.length - 2].trim().length === 0) {
        // Check if previous line is empty or contains spaces only
        context.report(node, location, 'Multiple empty lines at the end of file.');
      }
    }
  };
};
