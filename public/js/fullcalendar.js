/**
 * Created by cassie on 14/12/2.
 */
$(document).ready(function() {
    //fullcalendar日历组件调用
    //已认领的需求显示
    $('#calendar-allocated').fullCalendar({
        lang: 'zh-cn',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultView: 'basicWeek',
        contentHeight: 400,
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: {
            url: '/admin/line/list/myAllocatedJson'
        }
    });

    //未认领的需求显示
    $('#calendar-unAllocated').fullCalendar({
        lang: 'zh-cn',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultView: 'basicWeek',
        contentHeight: 400,
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: {
            url: '/admin/line/list/myUnallocatedJson'
        }
    });

    //列表、日历切换显示
    $('.show-calendar').click(function(){
        $(this).removeClass('btn-default').addClass('btn-primary');
        $('.show-list').removeClass('btn-primary').addClass('btn-default');
        $('.allocatedList').css('display','none');
        $('.calendar').css('visibility','visible');
    })
    $('.show-list').click(function(){
        $(this).removeClass('btn-default').addClass('btn-primary');
        $('.show-calendar').removeClass('btn-primary').addClass('btn-default');
        $('.allocatedList').css('display','block');
        $('.calendar').css('visibility','hidden');
    })
});

