const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const { logToConsole } = require('./utils/utils')

const d = new Date();
const curr_date = d.getDate();
const curr_month = d.getMonth() + 1;
const curr_year = d.getFullYear();


const fileNameBackup = `backup${curr_year}-${curr_month}-${curr_date}.zip`
const dirPath = path.join(__dirname,'backup','img',fileNameBackup);

const dirPathImg = path.join(__dirname,'static','img');

var output = fs.createWriteStream(dirPath);
var archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  logToConsole(`Success backup images ${fileNameBackup}`);
  
});


archive.on('warning', function(err) {
  logToConsole(err);
});

archive.on('error', function(err) {
  logToConsole(err);
});

archive.pipe(output);

//archive.directory('static/img/', false);
archive.directory(dirPathImg, false);


archive.finalize();
               
const { exec } = require('child_process');

// Where would the file be located?
const fileNameDump = `backup${curr_year}-${curr_month}-${curr_date}.sql`
const dumpFile = path.join(__dirname,'backup','db',fileNameDump);
//let dumpFile = 'stairs/backup/db/backup' + curr_year + "-" + curr_month + "-" + curr_date + '.sql';

// Database connection settings.
let exportFrom = {
	host: "localhost",
	user: "root",
	password: "1234",
	database: "stairs"

}

exec(`mysqldump -u${exportFrom.user} -p${exportFrom.password} -h${exportFrom.host} --databases --add-drop-database ${exportFrom.database} > ${dumpFile}`, (err, stdout, stderr) => {
	if (err) { 
    logToConsole(`exec error: ${err}`);
    return; 
  }else{
    logToConsole(`Success backup db ${fileNameDump}`);
  }
});

            

          