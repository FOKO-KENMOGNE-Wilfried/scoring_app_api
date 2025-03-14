import { AppDataSource } from "./data-source"
import express, { Express } from "express";
import fs from "fs"
import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { employeeRouter } from "./routes/employee.routes";
import { authRouter } from "./routes/auth.routes";
import { siteRouter } from "./routes/site.routes";
import { scoringRouter } from "./routes/scoring.routes";
import { spawn } from "child_process";
import axios from "axios";
import FormData from "form-data"
import { uploadImage } from "./middleware/multer";
import { Server } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();

const app: Express = express()
const { PORT = 3000 } = process.env;

const flaskProcess = spawn("python", ["src/face-recognition/app.py"]);
const server = http.createServer(app);
const io = new Server(server);

export { io };

io.on("connection", (socket) => {
    console.log("A client was connected established");

    socket.on("error", (err) => {
        console.log("Socket.IO error: ", err);
    })
})

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
app.use("/images", express.static(path.join(__dirname, '../images')));
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/sites", siteRouter);
app.use("/scoring", scoringRouter);

app.post('/train', uploadImage.single("image"), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('user_id', req.body.user_id);
        formData.append('image', fs.createReadStream(req.file?.path));
        const response = await axios.post('http://127.0.0.1:5000/train', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
        res.send(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : 'Erreur interne');
    }
});


app.use("*", (req: express.Request, res: express.Response) => {
    res.status(505).json({ message: "bad Request" });
});

AppDataSource.initialize()
    .then(async () => {

        server.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
            console.log("Press CTRL+C to stop the server.");
        });
        console.log("Data Source has beeen initialized!");

    })
    .catch(error => console.log(error))
