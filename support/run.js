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
  'nodeca.blogs'
];


// Install shelljs if not exists
function init(callback) {
  try {
    require('shelljs/global');
    callback();
    return;

  } catch (e) {}

  console.log('-- Pre-install dependencies');

  try {
    execSync('npm install shelljs', { stdio: 'inherit', cwd: appMainDir });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  process.nextTick(() => {
    // That should be done in callback, to not fail in node 6
    require('shelljs/global');
    callback();
  });
}


// Create synlinks for all app repos if not exist
function relink() {
  console.log('-- Check npm links');

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

        console.log(`-- Add npm link for '${name}'`);
        execSync('npm link', { stdio: 'inherit', cwd: pj(appsDir, name) });
        execSync(`npm link ${pkgName}`, { stdio: 'inherit', cwd: appMainDir });
        console.log('');
      });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}


// `git pull` in all apps repos.
// if app not exists or .git subfolder missed - reclone, relink & npm install
//
function do_pull(readOnly) {
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
        freshApps.push(app);

        console.log(`-- Installing '${app}' dependencies`);
        execSync('npm install', { stdio: 'inherit', cwd: appDir });
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

  relink();

  if (freshApps.length) {
    console.log(`-- Installing '${appMain}' dependencies`);
    execSync('npm install', { stdio: 'inherit', cwd: appMainDir });
  }
}


let task = {};

task.pull = function () {
  do_pull();
};


task['pull-ro'] = function () {
  do_pull(true);
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
        console.log(`-- Status of '${name}'`);
        execSync('git status', { stdio: 'inherit', cwd: pj(appsDir, name) });
        console.log('');
      });
  } catch (e) {}

  try {
    console.log(`-- Status of '${appMain}'`);
    execSync('git status', { stdio: 'inherit', cwd: appMainDir });
    console.log('');
  } catch (e) {}
};


////////////////////////////////////////////////////////////////////////////////

let command = argv[2];

if (!task.hasOwnProperty(command)) {
  console.log(`Help: run [${Object.keys(task).join('|')}]`);
  return;
}

init(() => task[command]());
