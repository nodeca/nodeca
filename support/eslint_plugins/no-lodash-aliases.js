/**
 * @fileoverview Rule to flag use an lodash aliases
 *
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

'use strict';

var LODASH_FN_ALIASES = {
  drop:      'rest',
  head:      'first',
  object:    'zipObject',
  tail:      'rest',
  take:      'first',
  unique:    'uniq',
  unzip:     'zip',
  all:       'every',
  any:       'some',
  collect:   'map',
  detect:    'find',
  each:      'forEach',
  eachRight: 'forEachRight',
  findWhere: 'find',
  foldl:     'reduce',
  foldr:     'reduceRight',
  include:   'contains',
  inject:    'reduce',
  select:    'filter',
  extend:    'assign',
  methods:   'functions'
};

var LODASH_NAMES = ['lodash', '_'];

module.exports = function(context) {

  return {
    'CallExpression': function(node) {

      var callee = node.callee;

      // Check patterns like `_.each(..)`,
      // that should be <Identifier.MemberExpression>
      if (callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier') {

        var objName = callee.object.name;

        if (LODASH_NAMES.indexOf(objName) !== -1 &&
            LODASH_FN_ALIASES[callee.property.name]) {
          var methodName = LODASH_FN_ALIASES[callee.property.name];
          var methodAlias = callee.property.name;
          context.report(
            node,
            '{{ldh}}.{{alias}}() is alias, use {{ldh}}.{{method}}() instead.',
            {
              ldh: objName,
              alias: methodAlias,
              method: methodName
            }
          );
        }
      }
    }
  };
};
