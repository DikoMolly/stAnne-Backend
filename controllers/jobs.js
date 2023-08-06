const Job = require("../model/jobs");

const handleErrors = (err)=>{
    console.log(err.message, err.code);
    let errors = {name:"", email:"", password:""};
    // duplicate error code
    if(err.code === 11000){
        errors.email = "Email already exist, choose a different email"
        return errors;
    }
    // validation errors
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
  
    // incorrect email from login
    if(err.message === "incorrect email"){
        errors.email = "Email is invalid or user does not exist"
    }
    if(err.message === "incorrect password"){
        errors.password = "Incorrect Password"
    }
    if(err.message === "CastError"){
      err.id = `No item with the specific id of ${err.value}`
    }
     
  
    return errors
  } 

  const badWords = [
    'mad', 
    'Stupid', 
    'fuck', 
    "Cumbubble", 
    "F*ck you", 
    "Shitbag", 
    "Asshole", 
    "Bastard",
    "Bitch",
    "Dickhead",
    "C*nt",
    "Son of a bitch",
    "Bollocks",
    "Penis",
    "Dick",
    "Boobs",
    "Breast",
    "Booty",
    "Sex",
    "Ass",
    "Prick",
    "Pant",
    "bitch",
    "Bra",
    "Pussy",
];

const filterInappropriateWords = (text) => {
    const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
    return text.replace(regex, '');
  };



  const getAllJob = async (req, res)=>{
    try {
        const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
        res.status(200).json({jobs, count:jobs.length})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
const getJob = async (req, res)=>{
    try {
        const {user:{userId}, params:{id:jobId}} = req
        const job = await Job.findOne({
            _id:jobId,
            createdBy: userId
        })
        if(!job){
            throw Error(`there is no job with id ${jobId}`)
        }
        res.status(200).json({ job })
    } catch (error) {   
        const errors = handleErrors(error)
      console.log(errors)
      res.status(500).json({ errors })
    }
}

// newly added
const allUserJob = async (req, res)=>{
    try {
        const alljob = await Job.find({}).populate('title')
        res.status(200).json({msg: alljob})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const allUserId = async (req, res)=>{
    const {params:{id:jobId}} = req

    try {
      // Fetch the post by its ID from the database
      const job = await Job.findById({_id: jobId}).populate('title');
  
      if (!job) {
        return res.status(404).json({ error: 'Post not found' });
      }
      job.views++;
      await job.save()
      res.status(200).json({ job });
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
}


const getAllPostForUser = async (req, res)=>{
    // const { userId } = req.params

    try {
      // Fetch the posts of the user by their ID from the database
      const jobPosts = await Job.find().where({createdBy: req.query.userId})
  
      if (!jobPosts) {
        return res.status(404).json({ error: 'User posts not found' });
      }
  
      res.status(200).json({ jobPosts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}




// end of newly added
// private route 
// only authenticated user can create a post
const createJob = async (req, res)=>{
    try {
        req.body.createdBy = req.user.userId
        const job = await Job.create(req.body)
        res.status(201).json({ job });
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

// private route
// only authenticated user can update post
const updateJob = async (req, res)=>{
   try {
    const {
        body:{title, postcontent},
        user:{userId},
        params: {id: jobId},

    } = req

    const filteredTitle = filterInappropriateWords(title);
    const filteredPostContent = filterInappropriateWords(postcontent);

    if (filteredTitle !== title || filteredPostContent !== postcontent) {
        throw new Error('Post title or Post content contains inappropriate words.');
      }

    if(title === '' || postcontent === ''){
        throw Error("Title or post fields cannnot be empty")
    }
    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body, {
        new:true, runValidators:true
    }
    )

    if(!job){
        throw Error(`there is no job with id ${jobId}`)
    }

    res.status(200).json({ job })
   } catch (error) {
        res.status(500).json({error: error.message})
   }
}

// private route
// only authenticate User can delete post
const deleteJob = async (req, res)=>{
    try {
        const {
            user:{userId}, 
            params:{id:jobId}
        } = req
    
        const job = await Job.findByIdAndRemove({
            _id: jobId,
            createdBy:userId
        })
        if(!job){
            throw Error(`No job with the specific ${jobId}`)
        }
        res.status(200).json({msg: "Deleted Succesfully"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}



module.exports = {
    getAllJob,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    allUserJob,
    allUserId,
    getAllPostForUser,
    
}