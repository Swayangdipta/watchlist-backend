const router = require('express').Router();
const {getContentById,getASingleContent,createContent,updateContentStatus,removeContent} = require('../controllers/content')
const {getUserById, isSignedIn, isAuthenticated} = require('../controllers/user')

router.param('contentId',getContentById);
router.param('userId',getUserById);

router.get('/content/:contentId',getASingleContent);
router.post('/upload/:userId',isSignedIn,createContent);
router.put('/edit/:contentId/:userId',isSignedIn,isAuthenticated,updateContentStatus);
router.delete('/remove/:contentId/:userId',isSignedIn,isAuthenticated,removeContent);



module.exports = router;