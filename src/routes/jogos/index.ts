import { Request, Response, Router } from 'express';
import jogosService from '../../services/jogos/index.js';

const router = Router();

/**
 * GET /jogos/:id
 * Get jogo by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log(`[JogosRoute] Received request for jogo: ${id}`);

    try {
        const jogo = await jogosService.getJogo(id);

        res.json(jogo);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[JogosRoute] Error processing request: ${errorMessage}`);

        res.status(500).json({
            error: `Failed to fetch jogo from service: ${errorMessage}`
        });
    }
});

export default router;
