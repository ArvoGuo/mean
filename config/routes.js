/**
 * 路由文件
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Line = require('../app/controllers/line');
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
    //判断登录是否中间件
    app.get('/admin/user/list',User.signinRequired,User.list);
    //电影
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/movie/new', User.signinRequired,Movie.new);
    app.get('/admin/movie/update/:id',User.signinRequired,Movie.update);
    app.post('/admin/movie',User.signinRequired,Movie.save);
    app.get('/admin/movie/list',User.signinRequired,Movie.list);
    app.post('/admin/movie/list',User.signinRequired,Movie.del);
    //业务线创建
    app.get('/line/:id',Line.detail);
    app.get('/line/new',User.signinRequired,Line.new);
    app.get('/line/update/:id',User.signinRequired,Line.update);
    app.post('/line',User.signinRequired,Line.save);
    app.get('/line/list',User.signinRequired,Line.list);
    app.post('/line/list',User.signinRequired,Line.del);
    //需求创建

}
