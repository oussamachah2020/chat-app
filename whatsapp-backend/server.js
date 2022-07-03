import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;
//app config

const pusher = new Pusher({
	appId: "1431894",
	key: "a039135c771dfbc1ad70",
	secret: "4f5abd2a43db39f5b6c4",
	cluster: "eu",
	useTLS: true,
});

const db = mongoose.connection;

db.once("open", () => {
	console.log("DB Connected!");

	const msgCollection = db.collection("messagecontents");
	const changeStream = msgCollection.watch();

	changeStream.on("change", (change) => {
		console.log(change);

		if (change.operationType == "insert") {
			const messageDetails = change.fullDocument;
			pusher.trigger("messages", "inserted", {
				name: messageDetails.name,
				message: messageDetails.message,
				timestamp: messageDetails.timestamp,
				received: messageDetails.received,
			});
		}else {
			console.log('Error triggering Pusher');
		}
	});
});

//middlware

app.use(express.json());
app.use(cors())

const connection_url = "mongodb+srv://oussama:OtakSam213@cluster0.teyx9.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//DB config

//????????

//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
	Messages.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

app.post("/messages/new", (req, res) => {
	const dbMessages = req.body;

	Messages.create(dbMessages, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

//listen
app.listen(port, () => console.log(`App listening on port ${port}`));
