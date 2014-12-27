/**
 * 路由文件
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Line = require('../app/controllers/line');
var Issue = require('../app/controllers/issue');
module.exports = function(app){
    //预处理用户
    app.use(function(req,res,next){
        var _user = req.session.user;
        app.locals.user = _user;
        next();
    })
    //首页
    app.get('/',Index.index);
    //用户
    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);
    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);
    app.get('/logout',User.logout);

    //管理员-用户管理
    app.get('/admin/user/list',User.signinRequired,User.list);
    app.post('/admin/user/list',User.signinRequired,User.del);

    //业务线创建
    app.get('/line/:id',User.signinRequired,Line.detail);
    app.get('/admin/line/new',User.signinRequired,Line.new);
    app.get('/admin/line/update/:id',User.signinRequired,Line.update);
    app.post('/admin/line',User.signinRequired,Line.save);

    //管理员-业务线管理
    app.get('/admin/line/list',User.signinRequired,Line.list);
    app.post('/admin/line/list',User.signinRequired,Line.del);

    //业务线增加成员
    app.post('/admin/line/addMember',User.signinRequired,Line.addMember);
    app.get('/admin/line/addMember',User.signinRequired,Line.addMember);

    //需求创建
    app.get('/issue/:id',User.signinRequired,Issue.detail);
    app.get('/admin/issue/new',User.signinRequired,Issue.new);
    app.get('/admin/issue/update/:id',User.signinRequired,Issue.update);
    app.post('/admin/issue',User.signinRequired,Issue.save);

    //管理员-需求列表管理
    app.get('/admin/issue/list',User.signinRequired,Issue.list);
    app.post('/admin/issue/list',User.signinRequired,Issue.del);

    //我的主页
    app.get('/admin/line/list/my',User.signinRequired,Issue.my);
    app.get('/admin/line/list/myIssueUnallocated',User.signinRequired,Issue.myIssueUnallocated);
    app.post('/admin/line/list/my',User.signinRequired,Issue.allocate);

    //业务线
    //我的主页-已认领的需求
    app.get('/admin/line/list/myAllocatedJson',User.signinRequired,Issue.myAllocatedJson);
    //我的主页-未认领的需求
    app.get('/admin/line/list/myUnallocatedJson',User.signinRequired,Issue.myUnallocatedJson);
    //我所在的业务线
    app.get('/admin/line/my',User.signinRequired,Line.my);
    //退出业务线
    app.post('/admin/line/my',User.signinRequired,Line.exit);

    //业务线-资源占用页面渲染
    app.get('/admin/line/role',User.signinRequired,Issue.selectRole);
    //业务线-资源占用-输入业务线关键词返回业务线
    app.post('/admin/line/role',User.signinRequired,Issue.returnLine);
    //业务线-资源占用-选择角色后返回该角色下地成员
    app.post('/admin/line/chooseRole',User.signinRequired,Issue.returnMember);
    //业务线-资源占用日历Json数组
    app.get('/admin/line/role/selectJson',User.signinRequired,Issue.selectJson);

    //业务线-需求列表
    app.get('/admin/all/issue/line',User.signinRequired,Issue.all);
    //业务线-需求列表Json数组
    app.get('/admin/all/issue/allIssueJson',User.signinRequired,Issue.allIssueJson);

}
