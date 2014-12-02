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
                    title: issue.title,
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
                title: '',
                desc: '',
                start: '',
                end: '',
                condition: '',
                role: '',
                unAllocatedRole: '',
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
exports.save = function (req, res) {
    var id = req.body.issue._id;
    var issueObj = req.body.issue;
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
                var role = issue.role;
                var allocatedRole = issue.allocatedRole;
                function arr_diff(a1, a2)
                {
                    var _unAllocatedRole = [];
                    var ROLE = [];
                    for(var i=0;i<a1.length;i++){
                        ROLE[a1[i]]=true;
                    }
                    for(var i=0;i<a2.length;i++){
                        if(ROLE[a2[i]]) delete ROLE[a2[i]];
                        else ROLE[a2[i]]=true;
                    }
                    for(var r in ROLE){
                        _unAllocatedRole.push(r);
                    }
                    return _unAllocatedRole;
                }
                //未认领的角色为该issue所有角色减去已认领的角色
                var _unAllocatedRole = arr_diff(role,allocatedRole)
                console.log('_unAllocatedRole:'+_unAllocatedRole);
                if(_unAllocatedRole != ''){
                    Issue.update({_id:id},{$set:{unAllocatedRole:_unAllocatedRole}}).exec();
                }else{
                    Issue.update({_id:id},{$set:{unAllocatedRole:null}}).exec();
                }
                res.redirect('/issue/' + _issue.id);
                //在issue集合里插入allocate字段
                //TODO: 修改业务线所需角色时，业务线allocate字段重复增加
                //for(var i=0;i<roleLength;i++){
                //    Issue.update({_id:id},{$set:{allocate:[{roleType: role[i],allocated:false,memberId:null}]}}).exec();
                //}
                //for(var i=0;i<(roleLength-1);i++){
                //    Issue.update({_id:id},{$pushAll:{allocate:[{roleType:role[i],allocated:false,memberId:null}]}}).exec();
                //}
            });
        });
    }
    //如果未创建issue,在这里新建
    else {
        _issue = new Issue(issueObj);
        var lineId = _issue.belongLineId;
        var role = _issue.role;
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
                Issue.update({_id:id},{$pushAll:{unAllocatedRole:role}}).exec();
                Line.findById(lineId, function(err, line) {
                    line.issues.push(issue._id);
                    line.save(function(err, line) {
                        if(err){
                            console.log(err)
                        }else{
                            res.redirect('/issue/' + issue._id)
                        }
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

//我认领的需求
exports.my = function(req,res){
    //查找我所在的业务线，罗列出所有需求
    var userId = req.session.user._id;
    var userRole = req.session.user.role;
    //如果登陆者在业务线内
    if (userId){
        //首先找到我在的业务线组
        Line.find({members:userId},function(err,lines){
            var lineLength = lines.length;
            var lineIdArray = [];
            //获取所有我所在的业务线的业务线id，组成数组
            for(var i=0;i<lineLength;i++){
                var lineId = lines[i]._id;
                lineIdArray.push(lineId);
            }
            //查找到我所在的业务线里的issue
            //我认领的需求
            Issue
                .find({belongLineId:{$in:lineIdArray},role:{"$in":[userRole]},members:{$in:[userId]}})
                .populate('belongLineId','name')
                .exec(function(err,issues){
                    console.log('lines:'+lines);
                    console.log('issues:'+issues);
                    if(err){
                        console.log(err)
                    }else{
                        res.render('myIssueList',{
                            title: '我的需求列表',
                            issues: issues
                        })
                    }
                })
        })
    }
}

//获取我认领的需求json数组
exports.myAllocatedJson = function(req,res){
    //查找我所在的业务线，罗列出所有需求
    var userId = req.session.user._id;
    var userRole = req.session.user.role;
    //如果登陆者在业务线内
    if (userId){
        //首先找到我在的业务线组
        Line.find({members:userId},function(err,lines){
            var lineLength = lines.length;
            var lineIdArray = [];
            //获取所有我所在的业务线的业务线id，组成数组
            for(var i=0;i<lineLength;i++){
                var lineId = lines[i]._id;
                lineIdArray.push(lineId);
            }
            //查找到我所在的业务线里的issue
            //我认领的需求
            Issue
                //只取title,start,end字段
                .find({belongLineId:{$in:lineIdArray},role:{"$in":[userRole]},members:{$in:[userId]}},{_id:0,title:1,start:1,end:1})
                .populate('belongLineId','name')
                .exec(function(err,issues){
                    console.log('lines:'+lines);
                    console.log('issues:'+issues);
                    if(err){
                        console.log(err)
                    }else{
                        res.json(issues)
                    }
                })
        })
    }
}

//我未认领的需求
exports.myIssueUnallocated = function(req,res){
    //查找我所在的业务线，罗列出所有需求
    var userId = req.session.user._id;
    var userRole = req.session.user.role;
    //如果登陆者在业务线内
    if (userId){
        //首先找到我在的业务线组
        Line.find({members:userId},function(err,lines){
            var lineLength = lines.length;
            var lineIdArray = [];
            //获取所有我所在的业务线的业务线id，组成数组
            for(var i=0;i<lineLength;i++){
                var lineId = lines[i]._id;
                lineIdArray.push(lineId);
            }
            //查找到我所在的业务线里的issue
            //我未认领的需求
            Issue
                .find({belongLineId:{$in:lineIdArray},role:{"$in":[userRole]},members:{$nin:[userId]}})
                .populate('belongLineId','name')
                .exec(function(err,issues){
                    console.log('lines:'+lines);
                    console.log('issues:'+issues);
                    res.render('myIssueUnallocated',{
                        title: '我的需求列表',
                        issues: issues
                    })
                })
        })
    }
}

//获取我未认领的需求json数组
exports.myUnallocatedJson = function(req,res){
    //查找我所在的业务线，罗列出所有需求
    var userId = req.session.user._id;
    var userRole = req.session.user.role;
    //如果登陆者在业务线内
    if (userId){
        //首先找到我在的业务线组
        Line.find({members:userId},function(err,lines){
            var lineLength = lines.length;
            var lineIdArray = [];
            //获取所有我所在的业务线的业务线id，组成数组
            for(var i=0;i<lineLength;i++){
                var lineId = lines[i]._id;
                lineIdArray.push(lineId);
            }
            //查找到我所在的业务线里的issue
            //我未认领的需求
            Issue
                //只取title,start,end字段
                .find({belongLineId:{$in:lineIdArray},role:{"$in":[userRole]},members:{$nin:[userId]}},{_id:0,title:1,start:1,end:1})
                .populate('belongLineId','name')
                .exec(function(err,issues){
                    console.log('lines:'+lines);
                    console.log('issues:'+issues);
                    if(err){
                        console.log(err)
                    }else{
                        res.json(issues)
                    }
                })
        })
    }
}

//我的主页需求列表-认领功能
exports.allocate = function(req,res){
    var id = req.query.id;
    var role = req.session.user.role;
    var memberId = req.session.user._id;
    if(id){
        Issue.findById(id,function(err,issue){
            if(err){
                console.log(err)
            }else{
                console.log('issue:'+issue);
                Issue.update({_id:id},{$push:{members:memberId}}).exec();
                Issue.update({_id:id},{$push:{allocatedRole:role}}).exec();
                Issue.update({_id:id},{$pull:{unAllocatedRole:role}}).exec();
                Issue.update({_id:id,'allocate.roleType':role},{$set:{'allocate.$.allocated':true,'allocate.$.memberId':memberId}}).exec();
                res.json({success:1});
            }
        })
    }
}

