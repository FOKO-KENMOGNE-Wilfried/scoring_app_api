import { AppDataSource } from "./data-source"
import express from "express";
import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { employeeRouter } from "./routes/employee.routes";

dotenv.config();

const app = express()
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(errorHandler);
app.use("/auth", employeeRouter);

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
