import { AppDataSource } from "./data-source"
import express, { Request, Response } from "express";
import fs from "fs"
import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { employeeRouter } from "./routes/employee.routes";
import { authRouter } from "./routes/auth.routes";
import { siteRouter } from "./routes/site.routes";
import { scoringRouter } from "./routes/scoring.routes";
import { spawn } from "child_process";
import axios from "axios";

dotenv.config();

const app = express()
const { PORT = 3000 } = process.env;

const flaskProcess = spawn("python", ["src/face-recognition/app.py"]);
// Output management
flaskProcess.stdout.on("data", (data) => {
    console.log(`Flask stdout: ${data}`);
});
// Error management
flaskProcess.stderr.on("data", (data) => {
    console.error(`Flask stderr: ${data}`);
});
// Server closing management
flaskProcess.on("close", (code) => {
    console.log(`Flask process exited with code ${code}`);
})

app.use(express.json());
app.use(errorHandler);
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/sites", siteRouter);
app.use("/scoring", scoringRouter);
app.post("/recognition", (req: Request, res: Response) => {
    var CloudmersiveImageApiClient = require('cloudmersive-image-api-client');
    var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

    // Configure API key authorization: Apikey
    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;

    var apiInstance = new CloudmersiveImageApiClient.FaceApi();
    var inputImage = Buffer.from(fs.readFileSync("public/test_image/4.jpg").buffer); // File | Image file to perform the operation on; this image can contain one or more faces which will be matched against face provided in the second image.  Common file formats such as PNG, JPEG are supported.
    var matchFace = Buffer.from(fs.readFileSync("public/test_image/2.jpg").buffer); // File | Image of a single face to compare and match against.

    var callback = function(error, data, response) {
        if (error) {
            console.error(error);
            res.status(500).json({data: error});
        } else {
            console.log('API called successfully. Returned data: ' + data);
            res.status(200).json({data: data});
        }
    };
    apiInstance.faceCompare(inputImage, matchFace, callback);
})

app.post('/get-embedding', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/extract_embedding', {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: req.body.image
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Erreur lors de l'appel à Flask : " + error.message);
    }
});

app.use("*", (req: express.Request, res: express.Response) => {
    res.status(505).json({ message: "bad Request" });
});

AppDataSource.initialize()
    .then(async () => {

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
            console.log("Press CTRL+C to stop the server.");
        });
        console.log("Data Source has beeen initialized!");

    })
    .catch(error => console.log(error))
