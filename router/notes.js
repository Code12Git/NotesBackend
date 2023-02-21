const express = require("express");
const Schema = require("mongoose");

const router = express.Router();
const { body, validationResult } = require("express-validator");
let FetchUser = require("../middleware/FetchUser");
const Notes = require("../models/Notes");

router.get("/fetchallnotes", FetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (e) {
    console.error(error.message);
    res.status(500).send(" Error occured");
  }
});

router.post("/addnote", FetchUser,
  [
    body("title", "Enter a valid title"),
    body("description", "Description must be atleats 5 characters").isLength({
      min: 5,
    }),
  ],
    async (req, res) => {
      try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const savedNote = await note.save();
        res.json(savedNote);
      } catch (error) {
        console.error(error.message);
        res.status(500).send(" Error occured");
      }
    
});

router.put('/updatenote/:id',FetchUser,async(req,res)=>{
  const{title,description,tag}=req.body;   
    try{
      const newNote={}
      if(title){
        newNote.title=title
      }
      if(description){
        newNote.description=description
      }
      if(tag){
        newNote.tag=tag
      }
      let  note=await Notes.findById(req.params.id)
      if(!note){
      return  res.status(404).send('Not Found')
      }
      if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
      }
      note=await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
        res.json({note});
    }

catch(error){
  res.status(404).send(error)
}
})

router.delete('/deletenote/:id',FetchUser,async(req,res)=>{
  try{
  let note=await Notes.findById(req.params.id)
  if(!note){return res.status(404).send("Not Found!")}
  if(note.user.toString()!==req.user.id){
    return res.status(404).send("Not Allowed")
  }
  note=await Notes.findByIdAndDelete(req.params.id)
  res.json({success:'Note deleted'})
}catch(error){
  res.sendStatus(500).json({Server:"Internal Server Error"})
}
})

module.exports = router;
