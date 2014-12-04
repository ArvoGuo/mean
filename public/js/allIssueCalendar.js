/**
 * Created by cassie on 14/12/3.
 */
$(document).ready(function() {
    //获取当前url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var paramQ = getQueryString('q');
    //fullcalendar日历组件调用
    $('#calendar').fullCalendar({
        lang: 'zh-cn',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultView: 'basicWeek',
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: {
            url: '/admin/all/issue/allIssueJson?q='+paramQ
        }
    });


    $('.list').click(function(){
        $('#calendar').css('visibility','hidden')
    });
    $('.calendar').click(function(){
        $('#calendar').css('visibility','visible')
    })
})