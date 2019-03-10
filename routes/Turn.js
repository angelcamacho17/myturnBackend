const express = require('express');
const turnRoutes = express.Router();

let Turn = require('../models/Turn');

turnRoutes.route('/').get(function(req, res) {
    Turn.find(function(err, turns) {
        if (err) {
            console.log(err);
        } else {
            res.json(turns);
        }
    });
});

turnRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Turn.findById(id, function(err, turn) {
        res.json(turn);
    });
});

turnRoutes.route('/add').post(function(req, res) {
    let turn = new Turn(req.body);
    turn.save()
        .then(turn => {
            res.status(200).json({'turn': 'turn added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new turn failed');
        });
});

turnRoutes.route('/update/:id').post(function(req, res) {
    Turn.findById(req.params.id, function(err, turn) {
        if (!turn)
            res.status(404).send('data is not found');
        else
            turn.TurnNumber = req.body.TurnNumber;
            turn.Next = req.body.Next;
            turn.Previous = req.body.Previous;
            turn.MinutesLeft = req.body.MinutesLeft;

            turn.save().then(turn => {
                res.json('turn updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

module.exports = turnRoutes