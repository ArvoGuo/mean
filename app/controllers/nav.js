/**
 * Created by cassie on 15/1/17.
 * 根据请求参数来判断当前页，给class加in
 */
exports.isIn = function(req,res,pagename){
    var page = (req.params[0]||'')+(req.params[1]||'')+(req.params[2]||'');
    return page == pagename ? "in": "";
}