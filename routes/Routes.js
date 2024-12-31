const express = require("express");
const { Registration, Login, Profile, AddPost, GetPost, addComment, CommentList} = require("../controller");
const router = express.Router();

router.post("/api/user_registration",Registration);
router.post("/api/user_login",Login);
router.post("/api/user_profile",Profile);
router.post("/api/user_addpost",AddPost);
router.post("/api/user_postlist",GetPost);
router.post("/api/user_addcomment",addComment);
router.get("/api/user_commentlist",CommentList);




module.exports = router;