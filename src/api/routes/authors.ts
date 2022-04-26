import { Router } from '..';
import { Author } from '../../db/models';

const router = new Router('authors');

// /authors
router.get('/', async (req, res) => res.json(await Author.findAll()));

// /authors/:id
router.get('/:id', async (req, res) => res.json(await Author.findByPk(req.params.id)));

export default router;
