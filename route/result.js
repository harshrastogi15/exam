const express = require('express');
const CSE = require('../model/CSE');
const ECE = require('../model/ECE');
const Math = require('../model/Math');
const MEA = require('../model/MEA');
const User = require('../model/user');
const router = express.Router();

router.get('/Generateresult', async (req, res) => {

    try {
        let user = await User.find({});
        for (i in user) {
            if(user.answer==undefined){
                continue;
            }
            var marks = 0;
            if (user[i].stream === 'CSE') {
                for (var j = 0; j < user[i].answer.length; j++) {
                    var q = await CSE.findById(user[i].answer[j].key);
                    if (user[i].answer[j].value === q.answer) {
                        marks++;
                    }
                }
            }else if (user[i].stream === 'ECE') {
                // console.log('ECE');
                // console.log(user[i]._id);
                for (var j = 0; j < user[i].answer.length; j++) {
                    // console.log(user[i].answer[j].key);
                    var q = await ECE.findById(user[i].answer[j].key);
                    if (user[i].answer[j].value === q.answer) {
                        marks++;
                    }
                }
            }else if (user[i].stream === 'MEA') {
                for (var j = 0; j < user[i].answer.length; j++) {
                    var q = await MEA.findById(user[i].answer[j].key);
                    if (user[i].answer[j].value === q.answer) {
                        marks++;
                    }
                }
            }else if (user[i].stream === 'Math') {
                for (var j = 0; j < user[i].answer.length; j++) {
                    var q = await Math.findById(user[i].answer[j].key);
                    if (user[i].answer[j].value === q.answer) {
                        marks++;
                    }
                }
            }
            // console.log(marks)
            await User.findByIdAndUpdate( user[i]._id, { marks: marks });
        }
        res.json({status:0});
    } catch (err) {
        res.json({status:-1});
    }
})

module.exports = router;