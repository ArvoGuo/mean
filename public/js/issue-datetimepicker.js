/**
 * Created by cassie on 14/12/1.
 * 需求创建页日期选择器调用
 */
$('.datetimepicker').datetimepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayBtn: true,
    pickerPosition: "bottom-center",
    weekStart: 1,
    todayBtn:  1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
});

//点击提交按钮增加dotting打点，并提示保存成功
$(function(){
    $('.postMsg').bind('click',function(e){
        e.preventDefault();
        swal({
            title: "Success!",
            text: "您已成功保存该需求!",
            type: "success",
            timer: 2000
        });
        var $target = $(e.target);
        $target.append('<span class="dotting"></span>');
        setTimeout(function(){
            $('form').submit();
        },2000);
    });
})
