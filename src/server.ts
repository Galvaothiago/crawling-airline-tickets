import express, {Express, Request, Response} from "express";
import {Crawler} from "./services/Crawler";
import {getAlternativesDate} from "./utils";
import dotenv from "dotenv";
import AppDataSource from "./database";
import {CreateJobDto} from "./entities/dto/createJobDto";
import {JobService} from "./services/JobsService";

const app: Express = express();
dotenv.config();

const port = process.env.PORT || 3333;

app.use(express.json());

app.get("/teste", async (req: Request, res: Response) => {
	const job: CreateJobDto = req.body;

	const jobService = new JobService();

	const jobs = await jobService.getAllJobs();

	return res.json(jobs);
});

app.get("/", async (req: Request, res: Response) => {
	const {initialDate, finalDate} = req.query;

	const alternativesDate: string[][] = getAlternativesDate(String(initialDate), String(finalDate));
	let finalResult = [];

	const puppeteer = new Crawler();

	await puppeteer.init();

	for (let i = 0; i < alternativesDate.length; i++) {
		const [initialDate, finalDate] = alternativesDate[i];

		const data = await puppeteer.searchFlight("VCP", "VIX", initialDate, finalDate);

		finalResult.push(data);
	}

	res.json(finalResult);
	await puppeteer.close();
});

app.listen(port, () => {
	AppDataSource.initialize();
	console.log(`Server is running on port ${port}`);
});
