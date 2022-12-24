import bodyParser from "body-parser";
import express from "express";
import request from "request";
import {
    fileURLToPath
} from "url";
import path from "path";
import https from "https";

const app = express();
// app.use(bodyParser.use({extended: true}))
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));




app.route("/")
    .get((req, res) => {
        res.sendFile(__dirname + "/signup.html");
    })

    .post((req, res) => {
        const firstName = req.body.fname;
        const lastName = req.body.lname;
        const email = req.body.email;
        const data = {
            members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }]
        };
        const jsonData = JSON.stringify(data);
        const url = "https://us20.api.mailchimp.com/3.0/lists/76a94959cd";
        const options = {
            method: "POST",
            auth: "rishivasista:8d2120157a9581d5dc81325a6bf61f4f-us20",
        };
        const request = https.request(url, options, (response) => {
            const status = response.statusCode;
            (status >= 200 && status < 300) ? res.redirect("/success"): res.redirect("/failure");
            response.on("data", (data) => {
                console.log(JSON.parse(data));
            });
        });

        request.write(jsonData);
        request.end();
        // console.log(firstName, lastName, email);
    });



app.route("/success")
    .get((req, res) => {
        res.sendFile(__dirname + "/success.html");
    });



app.route("/failure")
    .get((req, res) => {
        res.sendFile(__dirname + "/failure.html");
    })

    .post((req, res)=>{
        res.redirect("/");
    });




app.listen(3000, () => console.log("Server started on port 3000"));


// List Id
// 4cdd6e86c7

// API Key
// 8d2120157a9581d5dc81325a6bf61f4f-us20