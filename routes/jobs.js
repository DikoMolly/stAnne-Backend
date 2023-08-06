const express = require("express");
const router = express.Router();

const { 
    getAllJob, // private route only auth user can get all post
    getJob, // private route only auth user can get post by it's id
    createJob, // private route only auth user can create post
    updateJob, // private route only auth user can update post
    deleteJob, // private route only auth user can delete post
    // new routes as extra
    allUserJob, //public route only auth user can get all post of all users
    allUserId,   // public all auth user can access post id 
    getAllPostForUser,
     } = require("../controllers/jobs")

router.route("/").post(createJob).get(getAllJob);
router.route("/alljobs").get(allUserJob)
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);
router.route("/allid/:id").get(allUserId)
router.route("/post/allpostforuser/",).get(getAllPostForUser);





module.exports = router