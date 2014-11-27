/**
 * 需求集合
 */
var mongoose = require('mongoose');
var Issue = require('../models/issue');
var Line = require('../models/line');
var _ = require('underscore');
//需求详情页
exports.detail = function (req, res) {
    var id = req.params.id;
    Line.find({issues:id}, function (err, lines) {
        Issue
            //在line集合中查找issues字段id和issue集合的id相同的line
            //使用findOne,只取最后插入的一条
            .findOne({_id:id})
            .populate('belongLineId','name')
            .populate('creator','name')
            .exec(function(err,issue){
                res.render('issueDetail', {
                    title: issue.name,
                    lines: lines,
                    issue: issue
                })
            })
    })
};

//需求后台录入
exports.new = function (req, res) {
    var id = req.param.id;
    Line.find({},function(err,lines){
        res.render('issue', {
            title: '需求创建',
            issue: {
                creator: req.session.user._id,
                belongLineId: '',
                name: '',
                desc: '',
                start: '',
                end: '',
                condition: '',
                role: '',
                allocate: ''
            },
            lines: lines
        })
        console.log('id:'+id);
    //Issue.update({"_id":id},)
    })
};

//需求更新
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Issue.findById(id, function (err, issue) {
            Line.find({},function(err,lines){
                res.render('issue', {
                    title: '需求更新页面',
                    issue: issue,
                    lines: lines
                })
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
            _issue.save(function (err, issue) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/issue/' + _issue.id)
            });
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
                    console.log('lineType:'+typeof(line));
                    console.log('line.issues:'+line.issues);
                    line.issues.push(issue._id);
                    line.save(function(err, line) {
                        res.redirect('/issue/' + issue._id)
                    })
                })
            }
            //res.redirect('/issue/' + issue._id);
        })
    }
};


//需求列表页
exports.list = function (req, res) {
    Issue
        .find({})
        .populate('belongLineId','name')
        .exec(function(err,issues){
            if(err){
                console.log(err)
            }
            res.render('issueList',{
                title: '业务线列表页',
                issues: issues
            })
        })
};

//删除该需求
//所有put/delete方法都可以使用post方法
exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Issue.findById(id,function(err,issue){
            Line.find({issues:id},function(err,line){
                console.log('line:'+line);
                console.log('issue:'+issue);
                console.log('line[0]:'+line[0]);
                console.log('issue._id:'+issue._id);
                line[0].issues.pull(issue._id);
                Line.update({_id:issue.belongLineId},{$pull:{issues:issue._id}},{safe:true});
            })
        })
        Issue.remove({_id: id},function(err,issue){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1});
            }
        })
    }
};

//我的主页-需求列表
exports.my = function(req,res){
    //查找我所在的业务线，罗列出所有需求
    var userId = req.session.user._id;
    //如果登陆者在业务线内
    if (userId){
        Line.find({members:userId},function(err,line){
            var lineId = line[0]._id;
            Issue.find({belongLineId:lineId},function(err,issues){
                console.log('line:'+line);
                console.log('lineId:'+lineId);
                console.log('issues:'+issues);
                res.render('myIssueList',{
                    title: '我的需求列表',
                    issues: issues
                })
            })
        })
    }
    else {
    }
}
