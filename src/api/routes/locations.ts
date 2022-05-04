import { Router } from '..';
import { Location } from '../../db/models';

const router = new Router('locations');

// /locations
router.get('/', async (req, res) => res.json(await Location.findAll()));

// /locations/:id
router.get('/:id', async (req, res) => res.json(await Location.findByPk(req.params.id)));

export default router;
