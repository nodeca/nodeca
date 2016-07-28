#!/usr/bin/env node

'use strict';

const pj       = require('path').join;
const execSync = require('child_process').execSync;

/* eslint-disable no-console */
/* global test, mkdir, rm */

const appMain     = 'nodeca';
const appMainDir  = __dirname;

const appsRepoOrg = 'nodeca';
const appsDir     = pj(appMainDir, 'nodeca_modules');


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
  } catch (e) { process.exit(1); }

  process.nextTick(() => {
    // That should be done in callback, to not fail in node 6
    require('shelljs/global');
    callback();
  });
}

const argv = process.argv;

const apps = [
  'nodeca',
  'nodeca.core',
  'nodeca.users',
  'nodeca.forum',
  'nodeca.blogs'
];

const cmd = [
  'pull',
  'pull-ro',
  'push'
];

let task = {};


// `git pull` in all apps repos.
// if app not exists or .git subfolder missed - reclone, relink & npm install
//
function do_pull(readOnly) {
  let freshApps = []; // New apps, installed on this call

  if (!test('-d', appsDir)) mkdir(appsDir);

  apps.forEach(app => {
    if (app === appMain) return;

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
        console.log(`-- npm link for '${app}'`);
        execSync('npm link', { stdio: 'inherit', cwd: appDir });
        execSync(`npm link ${app}`, { stdio: 'inherit', cwd: appMainDir });
      }
    } catch (e) { process.exit(1); }
  });

  try {
    console.log(`-- Updating '${appMain}'`);
    execSync('git pull', { stdio: 'inherit', appMainDir });

    if (freshApps.length >= 0) {
      console.log(`-- Installing '${appMain}' dependencies`);
      execSync('npm install', { stdio: 'inherit', cwd: appMainDir });
    }
  } catch (e) { process.exit(1); }
}


task.pull = function () {
  do_pull();
};


task['pull-ro'] = function () {
  do_pull(true);
};


task.push = function () {
  apps.forEach(app => {
    const appDir = pj(appsDir, app);

    if (!test('-d', appDir)) return;
    if (!test('-d', pj(appDir, '.git'))) return;

    try {
      console.log(`-- Pushing '${app}'`);
      execSync('git push', { stdio: 'inherit', cwd: appDir });
    } catch (e) { process.exit(1); }
  });

  try {
    console.log(`-- Pushing '${appMain}'`);
    execSync('git push', { stdio: 'inherit', cwd: appMainDir });
  } catch (e) { process.exit(1); }
};


////////////////////////////////////////////////////////////////////////////////

let command = argv[2];

if (cmd.indexOf(command) === -1) {
  console.log(`Help: run [${cmd.join('|')}]`);
  return;
}

init(() => task[command]());
