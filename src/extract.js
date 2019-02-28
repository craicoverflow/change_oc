'use strict';
const prompt = require('prompt');
const colors = require('colors/safe');
const util = require('util');
const exec = require('child_process').execSync;
const tarball = require('tarball-extract');
const fs = require('fs');
const download_oc = require('./download');
const readlineSync = require('readline-sync');
const change = require('./change');

const ocpath = "openshift-origin-client-tools-v";

var extract_oc = function (callback){
    console.log("================================= Extract OC =======================================")
    let version = readlineSync.question(colors.cyan('What version of oc do you wish to install ? \n - 3.7\n - 3.9\n - 3.10\n - 3.11\n'));
    console.log("download version",version);
    fs.exists("../"+version +".tar.gz",function(err){
        if(err) {
            console.log("file read error: "+err);
        } else {
            tarball.extractTarball(version+".tar.gz", version, function(error){
                if(error) {
                    console.log("tarball error: "+error);
                } else {
                    console.log("File extracted");
                    
                    // move the files and remove the old directory
                    if (!fs.existsSync('/opt/openshift/'+ version)){
                        var versionpath = './'+version+'/'+ocpath+version+'*/*';
                        exec('mv '+versionpath+' ./'+version);
                        exec('rm -rf '+'./'+version+'/'+ocpath+version+'*');
                        exec('sudo mv ./'+ version +' /opt/openshift/'+ version);
                        console.log(change)
                        change(function(){
                            console.log('oc version changed to :' + version);
                        });
                    }else{
                        console.log("/opt/openshift/"+version+' exists already');
                        exec('rm -rf ./'+version);
                        change(function(){
                            console.log('oc version changed to :' + version);
                        });
                    }
                }
            });
        }

        if (typeof callback === 'function') {
            callback();
        }    
    });
};
module.exports = extract_oc;


