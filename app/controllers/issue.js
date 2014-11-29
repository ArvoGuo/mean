/**
 * 需求集合
 */
var mongoose = require('mongoose');
var Issue = require('../models/issue');
var Line = require('../models/line');
var User = require('../models/user');
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
    var role = issueObj.role;
    var roleLength = issueObj.role.length;
    var _issue;
    //如果已创建issue,在这里修改
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
                res.redirect('/issue/' + _issue.id);
                //在issue集合里插入allocate字段
                for(var i=0;i<roleLength;i++){
                    Issue.update({_id:id},{$set:{allocate:[{roleType: role[i],allocated:false,memberId:null}]}}).exec();
                }
                for(var i=0;i<(roleLength-1);i++){
                    Issue.update({_id:id},{$pushAll:{allocate:[{roleType:role[i],allocated:false,memberId:null}]}}).exec();
                }
            });
        });
    }
    //如果未创建issue,在这里新建
    else {
        _issue = new Issue(issueObj);
        var lineId = _issue.belongLineId;
        _issue.save(function (err, issue) {
            var id = issue._id;
            if (err) {
                console.log(err)
            }
            if (lineId) {
                console.log('roleLength:'+roleLength);
                for(var i=0;i<roleLength;i++){
                    Issue.update({_id:id},{$set:{allocate:[{roleType: role[i],allocated:false,memberId:null}]}}).exec();
                }
                for(var i=0;i<(roleLength-1);i++){
                    Issue.update({_id:id},{$pushAll:{allocate:[{roleType:role[i],allocated:false,memberId:null}]}}).exec();
                }
                Line.findById(lineId, function(err, line) {
                    line.issues.push(issue._id);
                    line.save(function(err, line) {
                        res.redirect('/issue/' + issue._id)
                    })
                })
            }
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
                //从line中将issue删除
                Line.update({_id:issue.belongLineId},{$pull:{issues:issue._id}}).exec();
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
    var userRole = req.session.user.role;
    //如果登陆者在业务线内
    if (userId){
        //首先找到我在的业务线组
        Line.find({members:userId},function(err,line){
            var lineId = line[0]._id;
            //查找到我所在的业务线里的issue
            Issue.find({belongLineId:lineId,role:{"$in":[userRole]}},function(err,issues){
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
}
