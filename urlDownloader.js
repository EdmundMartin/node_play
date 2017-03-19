var request = require('request');
var fs = require('fs');
var URL = require('url-parse');


var getURLsFromTextFile = function(file){
	var array = fs.readFileSync(file).toString().split('\r\n');
	return array;
}


var fixURLpaths = function(urlExtension){
	var badPath = '/';
	var re = new RegExp(badPath,'g');

	return urlExtension.replace(re,'-');
}


var bodyToHTML = function(url, body){
	const parsedURL = new URL(url)
	let extension = parsedURL.pathname;
	extension = fixURLpaths(extension);
	const fileName = `${parsedURL.hostname}${extension}.html`
	fs.writeFile(fileName,body,function(err){
		if(err){
			return console.log(err);
		}
	})
}


var grabURL = function(currentURL){
	request(currentURL, function(error, response, body){
		if(error){
			return;
		}
		if (response.statusCode === 200){
			bodyToHTML(currentURL,body);
		}
	})
}

function main(urlFile){
	const listOfUrls = getURLsFromTextFile(urlFile);
	while (listOfUrls.length > 0){
		currentURL = listOfUrls.pop();
		grabURL(currentURL);
	}
}

main('example.txt');
