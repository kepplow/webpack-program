import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../../fonts/iconfont.css';
import './login.less';
import { encode } from 'punycode';

$(function () {
    let hrt = $(window).height(); //获取当前可视区域的高度存到hrt的变量里。
    let timeCount = 60 // 设置倒计时
    let timeId = null
    //把获取到的高度直接赋值给body
    $('body').height(hrt+'px').resize(function () {
        $(this).height(hrt+'px');
    });

    // 获取当前日期 渲染到页面
    $(".date")[0].innerHTML = getNowDate();
    function getNowDate () {
        let date = new Date();
        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return date.toLocaleDateString().replace(/\//g, '-') + ' ' + weeks[date.getDay()];
    }

    // 点击登录
    $(".submit").on('click', function () {
        // 如果验证成功，跳转到首页
        let userName = $("#user-name").val();
        let password = $("#password").val();
        if (userName && password) {
            let fData = new FormData();
            fData.set('account', userName);
            fData.set('password', password);
            $.ajax({
                url: 'http://gaoxin.sccenze.com/api/user/login',
                type: 'post',
                contentType:false,
                processData: false,
                data: fData,
                success (res) {
                    if (res.code) {
                        localStorage.setItem('userInfo', encodeURIComponent(JSON.stringify(res.data)));
                        location.href = './index.html';
                    } else {
                        alert(res.msg);
                    } 
                }
            })
        } else {
            alert('请输入正确的账号和密码')
        }
    })

    // 清空密码
    $(".delate-password").on("click", function () {
        $("#password").val('');
    })
    let flag = true;
    // 点击忘记密码
    // $(".login p").on('click', function () {
    //     $("#reset-password").modal('show');
    //     $(".send").off('click');
    //     // 点击发送按钮
    //     $(".send").on("click", function () {
            
    //         if (flag) {
    //             flag = false;
    //             // 倒计时开始
    //             timeId = setInterval(() => {
    //                 if (timeCount <= 0) {
    //                     clearInterval(timeId);
    //                     flag = true;
    //                     timeCount = 60;
    //                     return
    //                 }
    //                 timeCount --;
    //                 $(this)[0].innerHTML = timeCount || '发送'; // 渲染倒计时
    //             }, 1000);
    //         }
    //     })
    // }) 
})