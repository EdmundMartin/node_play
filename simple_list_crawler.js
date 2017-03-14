var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

const output_file = 'example.csv';

var create_url_list = function(file){
	var array = fs.readFileSync(file).toString().split('\r\n');
	return array;
}


var file_writer = function(file,item){
	fs.appendFile(file, item, function(err){
		if(err){
			return console.log(err);
		}
	})
}

var grab_url = function(url_to_visit){
	request(url_to_visit, function(error, response, body){
		if(error){
			console.log(`${err} for URL: ${url_to_visit}`)
		}
		if (response.statusCode === 200){
			var result = cheerio.load(body);
			var title = result('title').text();
			let output_string = `"${url_to_visit}","${response.statusCode}","${title}"\r\n`;
			file_writer(output_file,output_string);
		} else {
			let output_string = `"${url_to_visit}","${response.statusCode}","N/A"\r\n`;
			file_writer(output_file,output_string);
		}
	})
}

var new_url_list = create_url_list('example.txt');

while (new_url_list.length > 0){
	current_url = new_url_list.pop();
	grab_url(current_url);
}
