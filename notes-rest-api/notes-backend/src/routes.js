const express = require('express');
const mongoose = require('mongoose'); 
const axios = require('axios');

const { Note } = require('./models');
const noteRouter = express.Router();

const notebooksApiUrl = process.env.NOTEBOOKS_API_URL;

// Create a new notebooks: POST '/'
// Retrieve all notebooks: GET '/'
// Retrieve a single notebook: GET '/:id' - localhost:8080/api/notebooks/:id
// Update a single notebook: PUT '/:id' - localhost:8080/api/notebooks/:id
// Delete a single notebook: DELETE '/:id' - localhost:8080/api/notebooks/:id


/*

const A = (req,res,next) => {
    
    Some Validation...

    next();
    }

const B = (req,res,next) => {
    
    Some Business logic...

    next(err);

    }

const C = (errors,req,res,next) => {
    
    Some error processing...

    }

noteRouter.post('/', A, B, C);

*/

const validateId = (req,res,next) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(404).json({err: "Note not found"});

    }

    next();

}

const errorHandling = (err,req,res,next) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({err: "Note not found"});

    }

    next();

}

noteRouter.post('/', async (req,res) => {
        try {

            const { title, content , notebookId} = req.body;

            let validatedNotebookId = null;

            if(!notebookId){

                console.info({
                    message: "Notebook ID not provided. Storing note without notebook."
                });

            } else if(!mongoose.Types.ObjectId.isValid(notebookId)){

                return res.
                status(400).
                json({ error : 'Notebook not found',notebookId});

            } else{

                try {
                    await axios.get(`${notebooksApiUrl}/${notebookId}`);
                    validatedNotebookId = notebookId;
                } catch (error) {

                    const jsonError = error.toJSON();

                    if(jsonError.status === 404){

                        return res.
                        status(400).
                        json({ error : 'Notebook not found',notebookId});


                    } else {

                        console.error({
                           
                            message: "Error verifying the notebook ID. Upstream notebooks not available. Storing note with provided ID for later verification",
                            notebookId,
                            error: error.message,
                            
                        });

                        // post something in a queue for later processing

                    }

                   // console.log(error); 
                }
                finally {
                    validatedNotebookId = notebookId;
                    }

            }


            if(notebookId){

                try {
                    await axios.get(`${notebooksApiUrl}/${notebookId}`);
                } catch (error) {
                    console.log(error);
                }

            }



            if(!title || !content){
                return res.status(400).json({error: "'title','content' field are required."});
            }

            const note = new Note({title,content,notebookId: validatedNotebookId});
            await note.save();
            res.status(201).json({data: note});
            
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    });
noteRouter.get('/', async (req,res) => {

    try {
        
        const note = await Note.find();
        return res.status(200).json({data: note});

    } catch (err) {
        res.status(500).json({error: err.message})
    }

});
noteRouter.get('/:id', validateId, async (req,res) => {
    try {
        
        const note = await Note.findById(req.params.id);

        if(!note){

            return res.status(404).json({err: "Note not found"});

        }

        return res.status(200).json({data: note});

    } catch (err) {
        res.status(500).json({error: err.message})
    }
});
noteRouter.put('/:id', validateId , async (req,res) => {
    try {

        const { title , content } = req.body;

        const note = await Note.findByIdAndUpdate(req.params.id,
            {title,content},
            {new: true}
        );

        if(!note){

            return res.status(400).json({err: "Note not found"});

        }

        return res.status(200).json({data: note});

    } catch (err) {
        res.status(500).json({error: err.message})
    }
});
noteRouter.delete('/:id', validateId , async (req,res) => {
    try {
        
        const note = await Note.findByIdAndDelete(req.params.id);

        if(!note){

            return res.status(404).json({err: "Note not found"});

        }

        return res.status(200).json({data: note});

    } catch (err) {
        res.sendStatus(204);
    }
});


module.exports = {
    noteRouter,
};