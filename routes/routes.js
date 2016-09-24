var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs');

router.get('/',function(req,res){
	res.sendFile(path.resolve(__dirname, '../static/view/index.html'));
});

router.post('/',function(req,res){
	var userName = req.body.userName;
	var totalSeats = req.body.totalSeats;
	var selectedSeats = req.body.selectedSeats.split(',');
	
	var data = require(path.resolve(__dirname, '../user.json'));

	var userObj = {
		userName: userName,
		totalSeats: totalSeats,
		selectedSeats: req.body.selectedSeats
	}

	data.users.push(userObj);
	data.registeredSeats = data.registeredSeats.concat(selectedSeats);
	var dataToWrite = JSON.stringify(data);

	fs.writeFile(path.resolve(__dirname, '../user.json'), dataToWrite, "utf8", function(err){
		res.json({error:err, data:data});
	});
});

router.get('/getUsers',function(req,res){
	var data = require(path.resolve(__dirname, '../user.json'));
	res.json(data);
})

module.exports = router
