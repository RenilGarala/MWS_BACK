const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/suggestions', projectController.getPartSuggestions);
router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/current', projectController.getCurrentProjects);
router.get('/completed', projectController.getCompletedProjects);
router.post('/:id/parts', projectController.addParts);
router.post('/:id/complete', projectController.completeProject);

module.exports = router;
