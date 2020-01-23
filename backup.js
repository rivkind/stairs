var fs = require('fs');
var archiver = require('archiver');

// create a file to stream archive data to.
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth() + 1;
var curr_year = d.getFullYear();
const date = '/backup/img/backup' + curr_year + "-" + curr_month + "-" + curr_date + '.zip';

var output = fs.createWriteStream(__dirname + date);
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function() {
  console.log('Data has been drained');
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.directory('static/img/', false);

archive.finalize();
               
const { exec } = require('child_process');

// Where would the file be located?
let dumpFile = 'stairs/backup/db/backup' + curr_year + "-" + curr_month + "-" + curr_date + '.sql';

// Database connection settings.
let exportFrom = {
	host: "localhost",
	user: "root",
	password: "1234",
	database: "stairs"

}
let importTo = {
	host: "localhost",
	user: "mysqluser",
	password: "mysqlpassword",
	database: "development_database"
}


exec(`mysqldump -u${exportFrom.user} -p${exportFrom.password} -h${exportFrom.host} --databases --add-drop-database ${exportFrom.database} > ${dumpFile}`, (err, stdout, stderr) => {
	if (err) { console.error(`exec error: ${err}`); return; }
});

            

          