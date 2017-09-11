#!/usr/bin/env node

'use strict';

const pj       = require('path').join;
const execSync = require('child_process').execSync;
const readdir  = require('fs').readdirSync;
const realpath = require('fs').realpathSync;

/* eslint-disable no-console */
/* global test, mkdir, rm */

const appMain     = 'nodeca';
const appMainDir  = pj(__dirname, '../');

const appsRepoOrg = 'nodeca';
const appsDir     = pj(appMainDir, 'nodeca_modules');

const argv        = process.argv;

const defaultApps = [
  'nodeca.core',
  'nodeca.users',
  'nodeca.forum',
  'nodeca.blogs',
  'nodeca.search',
  'nodeca.nntp'
];


// Install yarn and shelljs
//
function install_deps(callback) {
  let yarn_ver;

  try {
    yarn_ver = execSync('yarn --version');
  } catch (__) {}

  let m = String(yarn_ver).match(/^(\d+)\.(\d+)\.(\d+)/);

  // install/update yarn to at least 1.0.0 for --silent, --non-interactive, --version options
  if (!(m && Number(m[1]) >= 1)) {
    console.log('-- Installing yarn');
    execSync('npm install yarn -g', { stdio: 'inherit', cwd: appMainDir });
  }

  try {
    require('shelljs/global');
    callback();
    return;
  } catch (__) {}

  try {
    // Install shelljs into main node_modules, but keep nodeca/support as cwd
    // to avoid yarn installing all dependencies
    console.log('-- Installing shelljs');
    execSync(`yarn add shelljs --modules-folder "${appMainDir}/node_modules"`,
             { stdio: 'inherit', cwd: __dirname });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  process.nextTick(() => {
    // That should be done in callback, to not fail in node 6
    require('shelljs/global');

    // remove support/package.json and support/yarn.lock created by `yarn add` above
    rm(pj(__dirname, 'package.json'));
    rm(pj(__dirname, 'yarn.lock'));

    callback();
  });
}


// Create symlinks for all app repos if not exist
function relink() {
  console.log('-- Check symlinks');

  try {
    readdir(appsDir)
      .filter(name => test('-d', pj(appsDir, name, '.git')))
      .filter(name => test('-f', pj(appsDir, name, 'package.json')))
      .forEach(name => {
        const pkgName = require(pj(appsDir, name, 'package.json')).name;
        const pkgPath = pj(appMainDir, 'node_modules', pkgName);

        if (test('-L', pkgPath)) {
          try {
            if (realpath(pkgPath) === pj(appsDir, name)) return;
          } catch (e) {}
        }

        rm('-rf', pkgPath); // Remove [folder|broken symlink] prior to create new

        console.log(`-- Add link for '${name}'`);
        execSync('yarn link --non-interactive', { stdio: 'ignore', cwd: pj(appsDir, name) });
        execSync(`yarn link ${pkgName} --non-interactive`, { stdio: 'ignore', cwd: appMainDir });
        console.log('');
      });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}


// `git pull` in all apps repos.
// if app not exists or .git subfolder missed - reclone, relink & install;
// if branch is specified, try to move to that branch if it exists
//
function do_pull(readOnly, branch) {
  let freshApps = []; // New apps, installed on this call

  if (!test('-d', appsDir)) mkdir(appsDir);

  // pull/clone default apps
  defaultApps.forEach(app => {
    const appDir = pj(appsDir, app);

    const repo   = readOnly ?
      `https://github.com/${appsRepoOrg}/${app}.git`
    :
      `git@github.com:${appsRepoOrg}/${app}.git`;


    if (test('-d', appDir) && !test('-d', pj(appDir, '.git'))) rm('-rf', appDir);

    if (!test('-d', appDir)) mkdir(appDir);

    try {
      if (test('-d', pj(appDir, '.git'))) {
        console.log(`-- Updating '${app}'`);
        execSync('git pull', { stdio: 'inherit', cwd: appDir });
      } else {
        console.log(`-- Cloning '${app}', ${repo}`);
        execSync(`git clone ${repo}`, { stdio: 'inherit', cwd: appsDir });

        /* eslint-disable max-depth */
        if (branch && branch !== 'master') {
          console.log(`-- Moving to '${branch}' branch`);
          try {
            execSync(`git rev-parse --verify 'origin/${branch}' && ` +
                     `git checkout -b '${branch}' 'origin/${branch}'`,
                     { stdio: 'inherit', cwd: appDir });
          } catch (err) {}
        }

        freshApps.push(app);
      }
    } catch (e) { process.exit(1); }
  });

  // pull additional apps
  readdir(appsDir)
    .filter(name => defaultApps.indexOf(name) === -1)
    .filter(name => test('-d', pj(appsDir, name, '.git')))
    .forEach(name => {
      try {
        console.log(`-- Updating '${name}'`);
        execSync('git pull', { stdio: 'inherit', cwd: pj(appsDir, name) });
      } catch (e) { process.exit(1); }
    });

  // pull main app
  try {
    console.log(`-- Updating '${appMain}'`);
    execSync('git pull', { stdio: 'inherit', appMainDir });
  } catch (e) { process.exit(1); }

  readdir(appsDir)
    .filter(name => test('-d', pj(appsDir, name, '.git')))
    .forEach(name => {
      let deps_installed;

      try {
        execSync('yarn check --non-interactive', { stdio: 'ignore', cwd: pj(appsDir, name) });
        deps_installed = true;
      } catch (__) {}

      if (!deps_installed) {
        try {
          console.log(`-- Installing '${name}' dependencies`);
          execSync('yarn install --production --non-interactive',
                   { stdio: 'inherit', cwd: pj(appsDir, name) });
        } catch (e) { process.exit(1); }
      }
    });

  relink();

  if (freshApps.length) {
    console.log(`-- Installing '${appMain}' dependencies`);
    execSync('yarn install --non-interactive', { stdio: 'inherit', cwd: appMainDir });
  }

  let deps_installed;

  try {
    execSync('yarn check --non-interactive', { stdio: 'ignore', cwd: appMainDir });
    deps_installed = true;
  } catch (__) {}

  if (!deps_installed) {
    try {
      console.log('-- Installing all dependencies');
      execSync('yarn install --non-interactive', { stdio: 'inherit', cwd: appMainDir });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
}


let task = {};

task.pull = function (branch) {
  do_pull(false, branch);
};


task['pull-ro'] = function (branch) {
  do_pull(true, branch);
};


task.push = function () {
  try {
    readdir(appsDir)
      .filter(name => test('-d', pj(appsDir, name, '.git')))
      .forEach(name => {
        console.log(`-- Pushing '${name}'`);
        execSync('git push', { stdio: 'inherit', cwd: pj(appsDir, name) });
      });
  } catch (e) {}

  try {
    console.log(`-- Pushing '${appMain}'`);
    execSync('git push', { stdio: 'inherit', cwd: appMainDir });
  } catch (e) { process.exit(1); }
};

task.status = function () {
  try {
    readdir(appsDir)
      .filter(name => test('-d', pj(appsDir, name, '.git')))
      .forEach(name => {
        console.log(name);
        execSync('git status -s -b --porcelain', { stdio: 'inherit', cwd: pj(appsDir, name) });
        console.log('');
      });
  } catch (e) {}

  try {
    console.log(appMain);
    execSync('git status -s -b --porcelain', { stdio: 'inherit', cwd: appMainDir });
    console.log('');
  } catch (e) {}
};


////////////////////////////////////////////////////////////////////////////////

let command = argv[2];

if (!task.hasOwnProperty(command)) {
  console.log(`Help: run [${Object.keys(task).join('|')}]`);
  return;
}

install_deps(() => {
  task[command].apply(null, argv.slice(3));
});
