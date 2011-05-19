Updating GH-PAGES branch
========================

`gh-pages` is a branch on GitHub, which keeps latest API documentation and used
as "support" website.

In order to update `gh-pages` branch, you need to:

- recreate API documetnation
- copy it into temporary place
- drop any changes to the git working tree
- checkout on `gh-pages` branch`
- remove ALL files and directories (physiclly and with `git rm`)
- move all files under previously save doc dir into working tree
- git add files and commit changes

All these steps are recreated in support [script](scripts/update-gh-pages.sh)

See Also
--------

- [Generating API Documentation](documenting.md)
