import { AppDataSource } from "./data-source"
import express, { Request, Response } from "express";
import fs from "fs"
import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { employeeRouter } from "./routes/employee.routes";
import { authRouter } from "./routes/auth.routes";

dotenv.config();

const app = express()
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(errorHandler);
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
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

app.get("*", (req: express.Request, res: express.Response) => {
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
