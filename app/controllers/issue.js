/**
 * 需求集合
 */
var mongoose = require('mongoose');
var Issue = require('../models/issue');
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
    res.render('issue', {
        title: '需求创建',
        issue: {
            creator: req.session.user.name,
            belongLineName: '',
            belongLineId: '',
            title: '',
            desc: '',
            start: '',
            end: '',
            consition: '',
            role: ''
        }
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
exports.save = function (req, res) {
    var id = req.body.issue._id;
    var issueObj = req.body.issue;
    var _issue;
    if (id !== 'undefined') {
        Issue.findById(id, function (err, issue) {
            if (err) {
                console.log(err)
            }
            _issue = _.extend(issue, issueObj);
            _issue.save(function (err, issue) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/issue/' + _issue.id)
            })
        })
    } else {
        _issue = new Issue({
            creator: issueObj.creator,
            belongLineName: issueObj.belongLineName,
            belongLineId: issueObj.belongLineId,
            title: issueObj.title,
            desc: issueObj.desc,
            start: issueObj.start,
            end: issueObj.end,
            condition: issueObj.condition,
            role: issueObj.role
        });
        _issue.save(function (err, issue) {
            if (err) {
                console.log(err)
            }
            res.redirect('/issue/' + _issue.id)
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