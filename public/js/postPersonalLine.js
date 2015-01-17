/**
 * Created by cassie on 15/1/15.
 * 获取登录用户所在的业务线
 */
$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: '/admin/line/list/left'
    }).done(function(results){
        var $lineList = $('.line-list-left');
        if(!results.length){}
        else{
            if(!$lineList) return false;
            if($lineList.length){
                for(var i=0;i<results.length;i++){
                    $lineList.prepend('<li><a href="/admin/line/"><i class="project"></i><span>'+results[i].name+'</span></a></li>')
                }
            }
        }
    })

})
