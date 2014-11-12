/**
 * 业务线
 */
var mongoose = require('mongoose');
var Line = require('../models/line');
var _ = require('underscore');
//业务线详情页
exports.detail = function (req, res) {
    var id = req.params.id;
    Line.findById(id, function (err, line) {
        res.render('lineDetail', {
            title: line.title,
            line: line
        })
    })
};

//业务线后台录入
exports.new = function (req, res) {
    res.render('line', {
        title: '业务线创建',
        line: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
};

//业务线更新
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Line.findById(id, function (err, line) {
            res.render('line', {
                title: '业务线更新页面',
                line: line
            })
        })
    }
};

// admin post line
exports.save = function (req, res) {
    var id = req.body.line._id;
    var lineObj = req.body.line;
    var _line;

    if (id !== 'undefined') {
        Line.findById(id, function (err, line) {
            if (err) {
                console.log(err)
            }
            _line = _.extend(line, lineObj);
            _line.save(function (err, line) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/line/' + _line.id)
            })
        })
    } else {
        _line = new Line({
            doctor: lineObj.doctor,
            title: lineObj.title,
            country: lineObj.country,
            language: lineObj.language,
            year: lineObj.year,
            poster: lineObj.poster,
            summary: lineObj.summary,
            flash: lineObj.flash
        });

        _line.save(function (err, line) {
            if (err) {
                console.log(err)
            }
            res.redirect('/line/' + _line.id)
        })
    }
};

//业务线列表页
exports.list = function (req, res) {
    Line.fetch(function (err, lines) {
        if (err) {
            console.log(err)
        }
        res.render('lineList', {
            title: '业务线列表页',
            lines: lines
        })
    })
};

//删除该业务线
//所有put/delete方法都可以使用post方法
exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Line.remove({_id: id},function(err,line){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
};