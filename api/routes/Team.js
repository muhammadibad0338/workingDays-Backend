const express = require('express')
const router = express.Router();
const teamController = require('../controllers/team')


router.get('/currentUserTeam/:id',teamController.userTeam)
router.get('/searchUserInTeam/:key/softwareCompnay/:id',teamController.searchUserInTeam)


module.exports = router;