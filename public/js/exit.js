/**
 * Created by cassie on 14/12/2.
 */
//退出该业务线
$(function () {
    $('.exit').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-'+id);
        $.ajax({
            //注意，ajax type可以是delete?其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。
            type: 'POST',
            url: "/admin/line/my?id=" +id
        })
            .done(function (results) {
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove()
                    }
                }
            })
    })
})