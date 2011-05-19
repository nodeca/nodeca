#!/usr/bin/env sh


if test `git status -s | wc -l` -ne 0 ; then
    echo "Unclean working copy. Can't continue." >&2
    echo "Please, commit changes:"
    git status -s
    exit 128
fi


./support/generate-docs.rb \
    && rm -rf /tmp/doc \
    && mv doc /tmp/doc \
    && git reset --hard HEAD \
    && git checkout gh-pages \
    && rm -rf ./* \
    && git rm -rf ./* \
    && mv /tmp/doc/* . \
    && git add . \
    && git commit -m 'Update docs' \
    && git checkout master
