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
                url: '/admin/line/role/selectJson'
            },
            eventClick: function(event) {
                if (event.url) {
                    window.open(event.url);
                    return false;
                }
            }
        });
    }

    //post选中的data-role
    $('.select').click(function (e) {
        var target = $(e.target);
        var dataRole = target.data('role');
        var currentUrl = window.location.href
        var postUrl;
        if (currentUrl === 'http://localhost:3000/admin/line/role'){
            postUrl = currentUrl;
        }else{
            postUrl = currentUrl+"&";
        }
        $.ajax({
            type: 'POST',
            url: '/admin/line/role',
            data:"id="+dataRole
        })
            .done(function (results) {
                if (results.success === 1) {

                }
            })
    })
})