const express = require('express');
const app = express();

const config = require('./config');
const port = config.port || 3000;
const bodyParser = require('body-parser');

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.text());

let positions = {}; 

// id|latx_longy_role,id|...
app.post('/update', (req, res) => {
	const positionString = req.body;
	console.log(req);
	console.log(positionString);
	const devices = positionString.split(",");
	for (device in devices) {
		const id = devices[device].split("|")[0];
		const latx = devices[device].split("|")[1].split("_")[0];
		const longy = devices[device].split("|")[1].split("_")[1];
		const role = devices[device].split("|")[1].split("_")[2];
		positions[id] = { latx, longy, role };
	};
	res.send(generateString());
});

generateString = () => {
	let output = "";
	for (id in positions) {
		output += id + "|" + positions[id].latx + "_" + positions[id].longy + "_" + positions[id].role + ",";
	}
	return output;
}

app.listen(port, () => console.log("Listening at port " + port));