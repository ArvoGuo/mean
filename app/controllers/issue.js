/**
 * 需求集合
 */
var mongoose = require('mongoose');
var Issue = require('../models/issue');
var Line = require('../models/line');
var _ = require('underscore');
//业务线详情页
exports.detail = function (req, res) {
    var id = req.params.id;
    Issue.findById(id, function (err, issue) {
        res.render('issueDetail', {
            title: issue.title,
            issue: issue
        })
    })
};

//业务线后台录入
exports.new = function (req, res) {
    Line.find({},function(err,categories){
        res.render('issue', {
            title: '需求创建',
            issue: {},
            categories: categories,
        })
    })
};

//业务线更新
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Issue.findById(id, function (err, issue) {
            res.render('issue', {
                title: '需求更新页面',
                issue: issue
            })
        })
    }
};

// admin post issue
exports.save = function (req, res,next) {
    var id = req.body.issue._id;
    var issueObj = req.body.issue;
    var _issue;
    if (id) {
        Issue.findById(id, function (err, issue) {
            if (err) {
                console.log(err)
            }
            _issue = _.extend(issue, issueObj);
            next(_issue.save(function (err, issue) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/issue/' + _issue.id)
            }));
        })
    } else {
        _issue = new Issue(issueObj);
        var lineId = _issue.belongLineId;
        _issue.save(function (err, issue) {
            if (err) {
                console.log(err)
            }
            if (lineId) {
                Line.findById(lineId, function(err, line) {
                    line.issues.push(issue._id)
                    line.save(function(err, line) {
                        res.redirect('/issue/' + issue._id)
                    })
                })
            }
            res.redirect('/issue/' + issue._id);
        })
    }
};

//业务线列表页
exports.list = function (req, res) {
    Issue.fetch(function (err, issues) {
        if (err) {
            console.log(err)
        }
        res.render('issueList', {
            title: '业务线列表页',
            issues: issues
        })
    })
};

//删除该业务线
//所有put/delete方法都可以使用post方法
exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Issue.remove({_id: id},function(err,issue){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
};