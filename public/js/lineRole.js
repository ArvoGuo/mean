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
    var paramRoleId = getQueryString('roleId');
    var paramMemberId = getQueryString('memberId');
    console.log('paramQ:'+paramQ);
    console.log('paramRoleId:'+paramRoleId);
    console.log('paramMemberId:'+paramMemberId);

    //选择角色，给选中角色加上selected，button-primary样式
    $('.filterRole').click(function(e){
        var target = $(e.target);
        $('.filterRole').removeClass('selected btn-primary').addClass('btn-default');
        target.addClass('selected btn-primary').removeClass('btn-default');
        paramRoleId = $('.selected')[0].value;
        console.log('paramRoleId:'+paramRoleId);
        renderCalendar(paramRoleId);
    })

    function renderCalendar(paramRoleId){
        //fullcalendar日历组件调用
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
                url: '/admin/line/role/selectJson' + ((paramQ !== null) ? '?q=' + paramQ : '?q=') + ((paramRoleId !== null) ? '&roleId=' + paramRoleId : '&roleId=')
            },
            eventClick: function(event) {
                if (event.url) {
                    window.open(event.url);
                    return false;
                }
            }
        });
    }

})