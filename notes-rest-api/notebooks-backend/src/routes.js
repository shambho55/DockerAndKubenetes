const express = require('express');
const mongoose = require('mongoose');   
const { Notebook } = require('./models');
const notebookRouter = express.Router();

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

notebookRouter.post('/', A, B, C);

*/

const validateId = (req,res,next) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(404).json({err: "Notebook not found"});

    }

    next();

}

const errorHandling = (err,req,res,next) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({err: "Notebook not found"});

    }

    next();

}

notebookRouter.post('/', async (req,res) => {
        try {

            const { name, description} = req.body;

            if(!name){
                return res.status(400).json({error: "'name' field is required."});
            }

            const notebook = new Notebook({name,description});
            await notebook.save();
            res.status(201).json({data: notebook});
            
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    });
notebookRouter.get('/', async (req,res) => {

    try {
        
        const notebooks = await Notebook.find();
        return res.status(200).json({data: notebooks});

    } catch (err) {
        res.status(500).json({error: err.message})
    }

});
notebookRouter.get('/:id', validateId, async (req,res) => {
    try {
        
        const notebook = await Notebook.findById(req.params.id);

        if(!notebook){

            return res.status(404).json({err: "Notebook not found"});

        }

        return res.status(200).json({data: notebook});

    } catch (err) {
        res.status(500).json({error: err.message})
    }
});
notebookRouter.put('/:id', validateId , async (req,res) => {
    try {

        const { name , description } = req.body;

        const notebook = await Notebook.findByIdAndUpdate(req.params.id,
            {name,description},
            {new: true}
        );

        if(!notebook){

            return res.status(400).json({err: "Notebook not found"});

        }

        return res.status(200).json({data: notebook});

    } catch (err) {
        res.status(500).json({error: err.message})
    }
});
notebookRouter.delete('/:id', validateId , async (req,res) => {
    try {
        
        const notebook = await Notebook.findByIdAndDelete(req.params.id);

        if(!notebook){

            return res.status(404).json({err: "Notebook not found"});

        }

        return res.status(200).json({data: notebook});

    } catch (err) {
        res.sendStatus(204);
    }
});


module.exports = {
    notebookRouter,
};