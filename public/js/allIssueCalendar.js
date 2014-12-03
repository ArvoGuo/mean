/**
 * Created by cassie on 14/12/3.
 */
$(document).ready(function() {
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
            url: '/admin/all/issue/allIssueJson'
        }
    });

    $('.list').click(function(){
        $('#calendar').css('visibility','hidden')
    });
    $('.calendar').click(function(){
        $('#calendar').css('visibility','visible')
    })
})