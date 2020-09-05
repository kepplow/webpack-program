import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../../fonts/iconfont.css';
import './index.less';
import echarts from 'echarts';
// 引入冻结表头
import 'bootstrap-table/dist/bootstrap-table.min.css';
import 'bootstrap-table/dist/bootstrap-table.min.js';
// 引入冻结列
import 'bootstrap-table/dist/extensions/fixed-columns/bootstrap-table-fixed-columns.min.css';
import 'bootstrap-table/dist/extensions/fixed-columns/bootstrap-table-fixed-columns.min.js';



// dom解析完成
$(function () {
    var myChart = echarts.init(document.getElementById('echarts'));
    $(".table-responsive").hide();
    $("#echarts").hide()
    // let changeStateList = [],
    // let  searchData = {};
    // echats 图表配置
    
    let echartsOption = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            align: 'left',
            right: '12',
            top: '20',
            data: [{
                name: '自用房',
                icon: 'circle'
            }, {
                name: '租赁房',
                icon: 'triangle'
            }, {
            name: '闲置房',
            icon: 'rect'
            }]
        },
        series: [
            {
                name: '房源',
                type: 'pie',
                radius : '75%',
                center: ['25%', '45%'],
                label: {
                    normal: {
                    position: 'inner',
                    show : false
                    }
                },
                data:[
                    {value:335, name:'自用房', itemStyle: {
                        color: 'rgb(21, 167, 236)'
                    }},
                    {value:310, name:'租赁房', itemStyle: {
                        color: 'rgb(246, 2, 2)'
                    }},
                    {value:234, name:'闲置房', itemStyle: {
                        color: 'rgb(255, 235, 59)'
                    }}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // myChart.setOption(echartsOption, true);
    let selectData = {
        community: $(".community select").val(),
        residential: $(".residential select").val(),
        building: $(".building select").val()
    }
    
    $.ajax({
        url: 'http://gaoxin.sccenze.com/api/user/welcome',
        type: 'get',
        async: false,
        success (res) {
            $(".welcome").append(res.data);
        }
    })
        // location.search.slice(1).split('&').forEach(ele => {
        //     searchData[ele.split('=')[0]] = ele.split('=')[1]
        // })
    // 登录用户昵称
    // $(".user-info .nick-name").text(decodeURI(searchData.nickname));
    // 事件委托，dom修改后事件依旧有效
    // $('#table').on('click', ' td span', function() {
    //     // 关闭点击事件，防止绑定多次
        
    //     $('.modal-body .option').off('click');
    //     let that = $(this);
    //     console.log(that)
    //     let oClass = $(this)[0].classList[0];
    //     // 显示模态框
    //     $('#select-modal').modal('show');
    //     // 点击相应的按钮，改变table表格的内容
    //     $('.modal-body .option').on('click',function () {
    //         let newClass = $(this).find('span')[0].classList[0];
    //         that[0].classList.remove(oClass);
    //         that[0].classList.add(newClass);
    //         $('#select-modal').modal('hide');

    //         if (newClass == 'yuan') {
    //             stateus = '自用'
    //         } else if (newClass == 'sanjiao'){
    //             stateus = '一般租借'
    //         } else if (newClass == 'juxing') {
    //             stateus = '闲置'
    //         }
    //         changeStateList.push({
    //             id: that.data('id'),
    //             status: stateus
    //         })
    //     })
    // })
    
    // 获取社区列表数据
    getCommunity()
    function getCommunity () {
        $.ajax({
            url: 'http://gaoxin.sccenze.com/api/user/communitylist',
            type: 'post',
            // data: {
            //     uid: searchData.uid
            // },
            success (res) {
                if (res.code) {
                    if (res.data && res.data.length) {
                        let options = '<option value="0" disabled selected>社区</option>'
                        res.data.forEach((ele) => {
                            options += "<option value=" + ele.id + ">" + ele.community_name + "</option>"
                        })
                        $(".community select").html(options);
                    }
                }
            }
        })
    }
    // 获取小区列表数据
    function getResidential (id) {
        $.ajax({
            url: 'http://gaoxin.sccenze.com/api/user/xiaoqulist',
            type: 'post',
            data: {
                community_id: id
                // uid: searchData.uid
            },
            success (res) {
                // 插入dom结构
                if (res.code) {
                    if (res.data && res.data.length) {
                        let options = '<option value="0" disabled selected>小区</option>'
                        res.data.forEach((ele) => {
                            options += "<option value=" + ele.id + " data-number=" + ele.xiaoqu_number + ">" + ele.xiaoqu_name + "</option>"
                        })
                        $(".residential select").html(options);
                    }
                }
            }
        })
    }

    // 获取楼栋列表数据
    function getBuilding (id) {
        $.ajax({
            url: 'http://gaoxin.sccenze.com/api/user/buildinglist',
            type: 'post',
            data: {
                xiaoqu_id: id
            },
            success (res) {
                // 插入dom结构
                if (res.code) {
                    if (res.data && res.data.length) {
                        let options = '<option value="0" disabled selected>楼栋</option>'
                        res.data.forEach((ele) => {
                            options += "<option value=" + ele.building + ">" + ele.building + "</option>"
                        })
                        $(".building select").html(options);
                    }
                }
            }
        })
    }
    
    //获取本栋详细数据
    function getBuildingInfo (selectData) {
        $(".welcome").css('display', 'none');
        $(".table-responsive").show();
        $("#echarts").show()
        $.ajax({
            url: 'http://gaoxin.sccenze.com/api/user/buildingdetail',
            type: 'post',
            data: {
                community_id: selectData.community,
                xiaoqu_id: selectData.residential,
                building: selectData.building
            },
            success (res) {
                if (res.code) {
                    refresh(res, selectData.building);
                } else {
                    alert('数据获取失败，请重试！')
                }
                
            }
        })
    }
    // 刷新表格和图表
    function refresh (res, bNumber) {
        // changeStateList = []; // 重置状态改变列表
        // 饼图加载
        echartsOption.series[0].data.forEach(ele => {
            if (ele.name == '自用房') {
                ele.value = res.data.charData.ziyong
            } else if (ele.name == '租赁房') {
                ele.value = res.data.charData.zujie
            } else if (ele.name == '闲置房') {
                ele.value = res.data.charData.xianzhi
            }
        })
        myChart.setOption(echartsOption, true);
        
        // 定义表格大体结构
        let thead = $('<thead></thead>'),
            theadr1 = $('<tr></tr>'),
            theadr2 = $('<tr></tr>'),
            tbody = $('<tbody></tbody>');

        let maxCol = 0, // 单元格最大列数
            minrow = 0, // 单元格最小行数
            maxrow = 0; // 单元格最大行数
            // 设置表头第一行第一格
            theadr1.append('<th class="classification" rowspan="2"></th>')
   
        // 遍历数据计算单元格行列数,添加表头第一行
        res.data.tableData.forEach(unit => {
            // 每单元最大房间号
            let maxRoom = 0;
            if (unit.unit != '0单元') {
                unit.floors.forEach(floor => {
                    let floorNumber = 1*floor.floor.replace('负', '-').replace('楼', '');
                    // 判断单元格最大行数，最小行数
                    floorNumber > maxrow ? maxrow = floorNumber : '';
                    floorNumber < minrow ? minrow = floorNumber : '';
                    floor.rooms.forEach(room => {
                        // 判断每单元最大房间号
                        room.room_no > maxRoom ? maxRoom = room.room_no : '';
                    })
                })
                // 房间号累加获得单元格最大列数
                maxCol += maxRoom
                // 完善表头第一行
                theadr1.append('<th colspan=' + maxRoom +'>' + bNumber + unit.unit + '</th>')
            }
        })
        thead.append(theadr1);
        
        // 创建表格tbody
        for (let i = minrow; i <= maxrow; i++) {
            // 不计第0层
            if (i == 0) continue
            // 创建楼层和楼层第一列
            let tr = $('<tr data-floor="'+ i +'"><td>'+ i +'F</td></tr>');
            // 为每层创建房间
            for (let j = 1; j <= maxCol; j++) {
                tr.append('<td></td>')
            }
            
            let tmpMaxCol = 0; // 已经确定状态单元格最大列数
            res.data.tableData.forEach(unit => {
                let tmpMaxRoom = 0; // 当前单元最大房间号
                if (unit.unit != '0单元') {
                    unit.floors.forEach(floor => {
                        let floorNumber = floor.floor.replace('负', '-').replace('楼', '');
                        
                        floor.rooms.forEach(room => {
                            room.room_no > tmpMaxRoom ? tmpMaxRoom = room.room_no : '';
                            // 判断同一楼层
                            if (floorNumber == i) {
                                // 添加房屋状态 id 房号
                                if (room.room_status == '一般租借') {
                                    $(tr.children()[tmpMaxCol + room.room_no]).append('<span data-id="'+ room.id +'" data-no="'+ room.room_no +'" class="sanjiao"></span>')
                                } else if (room.room_status == '自用') {
                                    $(tr.children()[tmpMaxCol + room.room_no]).append('<span data-id="'+ room.id +'" data-no="'+ room.room_no +'" class="yuan"></span>')
                                } else if (room.room_status == '闲置') {
                                    $(tr.children()[tmpMaxCol + room.room_no]).append('<span data-id="'+ room.id +'" data-no="'+ room.room_no +'" class="juxing"></span>')
                                }
                            }
                        })
                    })
                    if (!theadr2.children()[tmpMaxCol]) {
                        // 添加表头第二行
                        for (let i = 1; i <= tmpMaxRoom; i++) {
                            theadr2.append('<th>' + i + '</th>')
                        }
                    }
                    tmpMaxCol += tmpMaxRoom
                }
                
            })
            thead.append(theadr2);
            // 向表格body内加入一行
            tbody.append(tr);
        }
        
        $("#table").bootstrapTable('destroy');
        $("#table").html(thead).append(tbody).bootstrapTable('resetView');
        $("#table").bootstrapTable({
            fixedColumns: true,
            fixedNumber: 1 // 固定列数
        });

    }
    // 选择社区之后加载小区列表数据
    $(".community select").on('change', function () {
        if ($(this).val()) {
            getResidential($(this).val());
            $(".building select").html('<option value="0" disabled selected>楼栋</option>');
        } else {
            $(".residential select").html('<option value="0" disabled selected>小区</option>');
            $(".building select").html('<option value="0" disabled selected>楼栋</option>');
        }
    })
    
    // 选择小区之后加载楼栋列表数据
    $(".residential select").on('change', function () {
        if ($(this).val()) {
            getBuilding($(this).val());
            // 显示具体位置号数
            $(".address-details").html($(".residential option:selected").data("number"));
        } else {
            $(".building select").html('<option value="0" disabled selected>楼栋</option>');
        }
    })

    // 选择楼栋加载详细数据
    $(".building select").on('change', function () {
        if ($(this).val()) {
            selectData = {
                community: $(".community select").val(), 
                residential: $(".residential select").val(),
                building: $(".building select").val()
            };
            getBuildingInfo(selectData);
        }
    })
    
    // 点击提交
    // $(".btn-submit").on("click", function () {
    //     console.log(JSON.stringify(changeStateList))
    //     $.ajax({
    //         url: 'http://gaoxin.sccenze.com/api/user/updateroom',
    //         type: 'post',
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             uid: searchData.uid,
    //             token: searchData.token,
    //             rooms: changeStateList
    //         }),
    //         success (res) {
    //             alert(res.msg);
    //             getBuildingInfo(selectData);
    //         }
    //     })
    // })
    
})
