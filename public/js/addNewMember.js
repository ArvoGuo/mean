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

    //点击提交按钮增加dotting打点
    $('.postMsg').bind('click',function(e){
        function a(callback){
            e.preventDefault();
            swal({
                title: "Good job!",
                text: "You clicked the button!",
                type: "success",
                timer: 2000
            })
            var $target = $(e.target);
            $target.append('<span class="dotting"></span>');
            callback();
        }
        function b(){
            $('form').submit();
        }
        a(b);
    });
})




