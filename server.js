const express = require('express');
const app = express();

const config = require('./config');
const port = config.port || 3000;
const bodyParser = require('body-parser');

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//Latitude_Longitude_Victim_Scout_Medic_Lifter

app.use(bodyParser.text());

let positions = {
       device1: {
               latx: "29",
               longy: "77",
               role: "S"
       },
       device2: {
               latx: "30",
               longy: "78",
               role: "V"
       },
       device3: {
               latx: "28",
               longy: "76",
               role: "L"
       },
       device4: {
               latx: "28.5",
               longy: "78",
               role: "M"
       },
       device5: {
               latx: "28.12",
               longy: "78.22",
               role: "V"
       }
};

let cluster = {
	"29.0_77.0" : {
		V: 2,
		S: 1,
		M: 1,
		L: 1
	}
};

let events = {
	KeralaFlood:"29.8775_31.8777_Alphadose_Flood",
	NorthIndiaHailstorm: "28.8775_30.8777_Alphadose_Hailstorm",
	NorthIndiaCyclone:"30.8775_32.8777_Alphadose_Cyclone",
	AssamEarthquake:"29.8775_31.8777_Alphadose_Earthquake",
	SouthIndiaCyclone:"30.8775_32.8777_Alphadose_Cyclone",
	ChennaiEarthquake: "28.8775_30.8777_Alphadose_Chennai",
	GujaratFlood:"29.8775_31.8777_Alphadose_Flood",
	WesternIndiaCyclone:"30.8775_32.8777_Alphadose_Cyclone",
	OrissaHailstorm: "28.8775_30.8777_Alphadose_Hailstorm"
};

//
// id|latx_longy_role,id|...
app.post('/update', (req, res) => {
	const positionString = req.body;
	console.log(positionString);
	if (positionString == "") {
		return res.send(generateString());
	}
	try {
		const devices = positionString.split(",");
		for (device in devices) {
			if(typeof devices[device].split("|")[1] == "undefined") break;
			const id = devices[device].split("|")[0];
			const latx = devices[device].split("|")[1].split("_")[0];
			const longy = devices[device].split("|")[1].split("_")[1];
			const role = devices[device].split("|")[1].split("_")[2];
			positions[id] = { latx, longy, role };
		};
	} catch (err) {
		console.log(err);
	}
	res.send(generateString());
});

app.get('/events', (req, res) =>  {
	return res.send(generateEventString());
});

app.post('/events', (req, res) => {
	const event = req.body;
	if(typeof req.body == "undefined") return res.send(generateEventString());
	const eventId = event.split("|")[0];
	events[eventId] = event.split("|")[1];
	console.log(events);
	return res.send(generateEventString());
})

app.get('/cluster', (req, res) => {
	let clusterId = req.query.id;
	console.log(clusterId);
	if(typeof cluster[clusterId] == "undefined") return res.send("");
	clusterInfo = cluster[clusterId];
	res.send(clusterInfo.V+"_"+clusterInfo.S+"_"+clusterInfo.M+"_"+clusterInfo.L);
});

app.post('/cluster', (req, res) => {
	let body = req.body.split("|");
	let clusterId = body[0];
	let role = body[1];
	if(typeof cluster[clusterId] == "undefined") {
		cluster[clusterId] = {
			V: 0,
			S: 0,
			M: 0,
			L: 0
		}
	}
	cluster[clusterId][role]++;
	console.log(cluster);
});

generateString = () => {
	let output = "";
	for (id in positions) {
		output += id + "|" + positions[id].latx + "_" + positions[id].longy + "_" + positions[id].role + ",";
	}
	return output;
}

generateEventString = () => {
	let output = "";
	Object.keys(events).forEach(function(key) {
	    value = events[key];
	    output+= key + "|" + value + ","
	});
	return output;
}


app.listen(port, () => console.log("Listening at port " + port));