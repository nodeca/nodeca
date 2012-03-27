Menus
=====

TBD

Upon namespace change (or on application load) once menus config was received as
part of the bundle we request permission test for each menu-item within current
namespace: `core.permissions-test({actions: ['a1', 'a2', ...]})`. Result is an
object: `{a1: true, a2: false, ...}` returned as JSON.
