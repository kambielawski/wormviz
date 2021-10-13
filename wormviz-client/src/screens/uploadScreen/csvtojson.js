// Reading the file using default
// fs npm package
const fs = require("fs");

function csvToJson(csvString) {

	var lines=csvString.split("\n");

	var result = [];

	var headers=lines[0].split(",");

	for(var i=1;i<lines.length;i++){

		var obj = {};
		var currentline=lines[i].split(",");
		if (!currentline[0])
			continue;

		for(var j=0;j<headers.length;j++){
			obj[headers[j]] = currentline[j];
		}

		result.push(obj);

	}

	return result;

	// fs.writeFileSync('output.json', JSON.stringify(result));
}

export default csvToJson;