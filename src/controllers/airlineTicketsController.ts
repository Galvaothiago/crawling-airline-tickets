import express, {NextFunction, Request, Response} from "express";
import {AirlineTicketsService} from "../../src/services/AirlineTicketsService";

const router = express.Router();

const airlineService = new AirlineTicketsService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const airlines = await airlineService.findAll();

	res.json(airlines);
});

router.get("/:date/:hours", async (req: Request, res: Response, next: NextFunction) => {
	const date = req.params.date;
	const hours = req.params.hours;

	if (!date || !hours) {
		res.status(400).json({message: "Invalid parameters"});
	}

	const newHour = hours?.split("-");

	const newDates = {
		initial: `${date} ${newHour[1]}:00:00.000`,
		final: `${date} ${newHour[0]}:59:59.999`,
	};

	console.log(newDates);

	const airlines = await airlineService.findBetweenDate(newDates.initial, newDates.final);
	res.json(airlines);
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	await airlineService.deleteAirlineTickets(req.params.id);
	res.status(204).json({});
});

export default router;
