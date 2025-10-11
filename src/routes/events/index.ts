import express, { Request, Response, NextFunction } from 'express';
import eventsService from '../../services/events/index.js';

const router = express.Router();

// GET /events/:date
router.get('/:date', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.params;

    // Validação básica de formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Expected YYYY-MM-DD'
      });
    }

    const events = await eventsService.getEventsByDate(date);

    res.status(200).json({ events });
  } catch (error) {
    next(error);
  }
});

export default router;
