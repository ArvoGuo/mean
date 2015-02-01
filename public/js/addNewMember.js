/**
 * Created by cassie on 14/12/24.
 */
$(function(){
    //填写成员花名时，发送花名并返回用户id
    $('.new-member-input').on('keyup',function(e){
        var $target = $(e.target);
        var newMemberName = $target[0].value;
        var ul = [];
        $.ajax({
            type: 'POST',
            url: '/admin/line/addMember?name='+newMemberName
        })
            .done(function(results){
                if(!results.length){
                    $('#relatedMember').children().remove();
                }
                if(results.length){
                    $('#relatedMember li').remove();
                    for(var i=0;i<results.length;i++){
                        var userName = results[i].name;
                        var userId = results[i]._id;
                        var li = "<li data-id="+userId+" "+"data-name="+userName+">"+userName+"<span class='glyphicon glyphicon-plus' style='float:right'></span>"+"</li>";
                        ul.push(li);
                    }
                    $('#relatedMember').show().append(ul);
                    //点击下拉花名，将该成员选中并添加
                    $('#relatedMember li').click(function(e){
                        var $targetLi = $(e.target);
                        var selectedUserId = $targetLi.data('id');
                        var selectedUserName = $targetLi.data('name');
                        var roleSelect = "<label class='role-select'><input style='margin-left:10px' type='checkbox' name='line[members]' value='"+selectedUserId+"'checked><span style='margin-left:5px'>"+selectedUserName+"</span></label>";
                        $('#added-member').append(roleSelect);
                    })
                }
            })
    });

    //点击提交按钮增加dotting打点，并提示保存成功
    //$('.postMsg').bind('click',function(e){
    //        e.preventDefault();
    //        swal({
    //            title: "Success!",
    //            text: "您已成功保存该业务线!",
    //            type: "success",
    //            timer: 2000
    //        });
    //        var $target = $(e.target);
    //        $target.append('<span class="dotting"></span>');
    //        setTimeout(function(){
    //            $('form').submit();
    //        },2000);
    //});

    //表单必填项验证
    $('#defaultForm').bootstrapValidator({
//        live: 'disabled',
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            'line[name]':{
                validators: {
                    notEmpty: {
                        message: '请填写业务线名称'
                    }
                }
            },
            'line[desc]': {
                validators: {
                    notEmpty: {
                        message: '请填写业务线描述'
                    }
                }
            }
        }
    });
})




