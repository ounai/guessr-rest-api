import { Router } from '..';
import { Location } from '../../db/models';

const router = new Router('locations');

// GET /locations/random
//
// Returns ID of a random location
// Will return null if there are no locations in DB
router.get('/random', async (req, res) => res.json(await Location.findRandomId()));

// These routes will be used by a location manager app, which is to be built at a later date.
// Gameplay related to locations will use the /guesses API.
//
// TODO: Authenticate users of these routes, except for /locations/random defined above

// GET /locations
router.get('/', async (req, res) => res.json(await Location.findAll()));

// GET /locations/:id
router.get('/:id', async (req, res) => res.json(await Location.findByPk(req.params.id)));

// TODO: create location
// TODO: update location
// TODO: delete location

export default router;
