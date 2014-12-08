/**
 * Created by cassie on 14/12/4.
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
    if(paramQ !== null) {
        $('#calendar').fullCalendar({
            lang: 'zh-cn',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultView: 'basicWeek',
            contentHeight: 300,
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: {
                url: '/admin/line/role/selectJson?q=' + paramQ
            },
            eventClick: function(event) {
                if (event.url) {
                    window.open(event.url);
                    return false;
                }
            }
        });
    }else{
        $('#calendar').fullCalendar({
            lang: 'zh-cn',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultView: 'basicWeek',
            contentHeight: 300,
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: {
                url: '/admin/line/role/selectJson',
                color: 'yellow'
            },
            eventClick: function(event) {
                if (event.url) {
                    window.open(event.url);
                    return false;
                }
            }
        });
        $('#calendar').fullCalendar( 'addEventSource', {
            events: [
                {
                    id: 1,
                    title: 'All Day Event',
                    start: '2014-12-05'
                },
                {
                    title: 'Click for Google',
                    url: 'http://google.com/',
                    start: '2014-12-09'
                }
            ]
        } )
    }


    //获取url里参数填充到input[type="hidden"]
    var paramRoleId = getQueryString('roleId');
    var paramMemberId = getQueryString('memberId');
    var inputQ = '<input type="hidden" name="q" value="'+paramQ+'">';
    var inputRoleId = '<input type="hidden" name="roleId" value="'+paramRoleId+'">';
    if(paramQ){
        $('.inputQ').val(paramQ);
    }
    //if(paramRoleId){
    //    $('.paramInput').append(inputRoleId);
    //}
})