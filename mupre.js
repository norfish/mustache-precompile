#!/usr/bin/env node

/**
 * Module dependencies.
 */

var
  syspath = require('path'),
  hogan = require('hogan.js'),
  fs = require('fs'),
  _ = require('lodash'),
  async = require('async'),
  optimist = require('optimist'),
  mkdirp = require('mkdirp'),
  program = require('commander');

function precompile (txt, path, cb){
  var builded, name;
  try {
    name = syspath.basename(path, '.mustache');
    builded = 'if(typeof window.QTMPL === "undefined"){ window.QTMPL={}; }\n';
    builded += 'window.QTMPL.' + name + ' = new window.Hogan.Template(' + hogan.compile(txt, {
      asString: 1
    }) + ');';
    return cb(builded);
  } catch (err) {
    return cb(err);
  }
}

function parseFile(file){

  if(!file){
    console.log('you should enter a filename');
    return;
  }
  var dir = process.env.PWD;
  var filepath = syspath.join(dir, file + '.mustache');

  var tarpath = syspath.join(dir, file + '.js');
  var txt = read(filepath);
  var content = precompile(txt, filepath, function(data){
    return data;
  });

  write(tarpath, content);
  return 'done';
}

function read(filepath){
  /*if(fs.exists( syspath.dirname(filepath) ) ){
    throw('cannot find ' + filepath);
  }else{*/
    return fs.readFileSync( filepath ).toString().replace( /\r\n/g , '\n' );
  //}
}

function write(tar, content){
  if(!fs.exists(syspath.dirname(tar))){
    mkdirp.sync(syspath.dirname(tar), function(err){
      if(err){
        console.log('error when mkdir');
      }else{
        console.log('write done');
      }
    });

    fs.writeFileSync(tar, content);
    console.log('done');
  }
}

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-f --file <n>', 'template file to compile', parseFile)
  .parse(process.argv);

console.log(' compiling %s');



