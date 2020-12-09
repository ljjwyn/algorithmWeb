
indexApp
	.controller(
		'anaTaskCreateManageCtrl',
			function($scope, $http, $timeout, $interval) {
                //$scope.url = "http://119.167.221.16:23000/";
                //$scope.url = "http://10.24.11.183:3000/";
                $scope.url = "http://127.0.0.1:3000/";

                $scope.taskConfig = {
                    taskId: null,
                    taskName: "",
                    createTime: null,
                    taskDesc: ""
                };

                $scope.taskList = [];
                $scope.focusTask = null;

                $scope.createTask = function() {

                    if ($scope.taskConfig.taskName.trim() === "") {
                        Swal("任务名不能为空！");
                    } else {
                        $http({
                            method : 'POST',
                            headers : {
                                'Content-Type' : 'application/json',
                            },
                            url : "taskManagement/insert",
                            data : $scope.taskConfig
                        }).then(function(resp, status) {
                            $scope.taskConfig.taskId = resp.data.taskId;
                            console.log(resp.data);
                            $scope.status = status;
                            Swal("创建成功");

                            document.cookie="taskId="+$scope.taskConfig.taskId;
                            $scope.getAllTasks();
                            $interval(function () {
                                location.href = "ana-dataset.html";
                            }, 1000);

                        }, function(resp, status) {
                            $scope.resp = resp;
                            $scope.status = status;
                        });
                    }

                };


                /**
                 * 列出所有任务
                 */
                $scope.getAllTasks = function () {
                    console.log("[INFO] You are getting tasks");
                    // 任务输出隐藏
                    $scope.taskOuputDivVisible = false;

                    $http({
                        method: 'GET',
                        url: 'taskManagement/getalltask',
                    }).then(function (resp, status) {
                        $scope.taskList = resp.data;

                        console.log("[INFO] Task list includes: ");
                        console.log(resp.data);
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                };


                /**
                 * 删除任务
                 *
                 */
                $scope.delTask = function (task) {
                    console.log("[DELETE TASK] You are deletting the task whose id is "
                        + task.taskId);
                    swal({
                        title: '确认删除该任务',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: '删除',
                        cancelButtonText: '取消'
                    }).then(function(isConfirm) {
                        console.log("ic",isConfirm);
                        if (isConfirm.value) {
                            $http(
                                {
                                    method: 'POST',
                                    url: 'taskManagement/delete/',
                                    data: task
                                }).then(function (resp, status) {
                                $scope.getAllTasks();
                            }, function (resp, status) {
                                //$scope.getAllTasks();
                            });
                        }
                    })


                };

                var countLabel=null;
                var labelDes=null;
                var dataList=[];
                var labelList=[];
                $scope.tableItemPre=[];
                $scope.mysqlTableSampleDataPre=[];
                $scope.itemTypePre={};
                $scope.countItemPre=[];
                $scope.taskConf=null;
                $scope.taskOuputDivVisible=false;
                $scope.taskModelDisplay=false;
                $scope.labelRules=null;
                $scope.labelDescription=null;
                $scope.taskInformation=null;
                $scope.predictTableList=[];
                $scope.preTableIndex=null;
                $scope.allShowFlage=false;
                $scope.currentMySQLTablePre={
                    name:null,
                    database:"predictDataSet"
                };
                $scope.tagLink=function(){
                    document.cookie="taskId="+$scope.focusTask.taskId;
                    console.log("document.cookie",document.cookie);
                    $interval(function () {
                        location.href = "predictTableLink.html";
                    },1000);
                };
                $scope.predictDetail=function(){
                    document.cookie="taskId="+$scope.focusTask.taskId;
                    console.log("document.cookie",document.cookie);
                    $interval(function () {
                        location.href = "itemDetail.html";
                    },1000);
                };
                $scope.switchTable=function(){
                    $scope.currentMySQLTablePre.name=null;
                    countLabel=[];
                    labelDes=[];
                    dataList=[];
                    labelList=[];
                    $scope.taskConf=null;
                    $scope.labelRules=null;
                    $scope.labelDescription=null;
                    $scope.focusTask.tableName=$scope.predictTableList[parseInt($scope.preTableIndex)];
                    console.log("$scope.preTableIndex",$scope.preTableIndex);
                    console.log("$scope.focusTask.tableName",$scope.focusTask.tableName);
                    $http({
                        method: 'POST',
                        url: $scope.url+'display',
                        data:$scope.focusTask
                    }).then(function (resp, status) {
                        $scope.currentMySQLTablePre.name= resp.data.predictTableName;
                        countLabel=resp.data.countLabel;
                        labelDes=resp.data.labelDes;
                        $scope.taskConf=resp.data.taskConf;
                        console.log('conf',$scope.taskConf);
                        $scope.labelRules=resp.data.taskRules;
                        console.log('rules',$scope.labelRules);
                        $scope.labelDescription=JSON.stringify(resp.data.labelDes);
                        console.log('des',$scope.labelDescription);
                        for(var key in labelDes){
                            chartMap={};
                            labelList.push(labelDes[key]);
                            chartMap.value=countLabel[key];
                            chartMap.name=labelDes[key];
                            dataList.push(chartMap);
                        }
                        $scope.allShowFlage=true;
                        $scope.getPreDataSample();
                        $scope.get3dchart();
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                };
                $scope.showTaskDetail = function (task) {
                    $scope.allShowFlage=false;
                    countLabel=[];
                    labelDes=[];
                    dataList=[];
                    labelList=[];
                    $scope.focusTask = task;
                    console.log("taskName",$scope.focusTask);
                    $http({
                        method:'POST',
                        url:$scope.url+'getpredicttablename',
                        data:$scope.focusTask
                    }).then(function (resp, status) {
                        $scope.predictTableList=resp.data.tableNameList;
                        $scope.taskInformation=resp.data.taskInformation;
                        $scope.taskConf=resp.data.taskConf;
                        $scope.labelRules=resp.data.taskRules;
                        console.log('rules',$scope.labelRules);
                        $scope.labelDescription=JSON.stringify(resp.data.labelDes);
                        console.log('des',$scope.labelDescription);
                        console.log("predictTable",$scope.predictTableList);
                        if($scope.taskInformation==="建模"){
                            $scope.taskOuputDivVisible=false;
                            $scope.taskModelDisplay=true;

                        }else {
                            $scope.taskOuputDivVisible=true;
                            $scope.taskModelDisplay=false;
                        }
                        $scope.status = status;
                    },function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                };
                $scope.getPreDataSample=function () {
                    $scope.tableItemPre=[];
                    $scope.mysqlTableSampleDataPre=[];
                    $scope.itemTypePre={};
                    $scope.countItemPre=[];
                    $http({
                        method: 'post',
                        url: $scope.url+'gettableItem',
                        data:$scope.currentMySQLTablePre
                    }).then(function (resp, status) {
                        $scope.tableItemPre=resp.data.res;
                        console.log($scope.tableItemPre);
                        for (var i = 0; i<$scope.tableItemPre.length; i++) {
                            $scope.countItemPre.push(i.toString());
                        }
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                    $http({
                        method: 'post',
                        url: $scope.url+'getsortsampledata',
                        data:$scope.currentMySQLTablePre
                    }).then(function (resp, status) {
                        $scope.mysqlTableSampleDataPre=resp.data.res;
                        console.log($scope.mysqlTableSampleDataPre);
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                };
                $scope.get3dchart=function () {
                    //echarts.init(document.getElementById('3DChart')).dispose();
                    var myChart = echarts.init(document.getElementById('3DChart'));
                    console.log(myChart);
                    myChart.setOption({
                        title : {
                            text: '预测标签图',
                            subtext: '依据分类模型预测',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            x : 'center',
                            y : 'bottom',
                            data:labelList
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {
                                    show: true,
                                    type: ['pie', 'funnel']
                                },
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        series : [
                            {
                                name:'半径模式',
                                type:'pie',
                                radius : [20, 110],
                                center : ['25%', 200],
                                roseType : 'radius',
                                width: '40%',       // for funnel
                                max: 40,            // for funnel
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : false
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : true
                                        },
                                        labelLine : {
                                            show : true
                                        }
                                    }
                                },
                                data:dataList
                                /*[
                                    {value:$scope.preCountList[0], name:'亏损百亿'},
                                    {value:$scope.preCountList[1], name:'亏损十亿'},
                                    {value:$scope.preCountList[2], name:'亏损亿'},
                                    {value:$scope.preCountList[3], name:'亏损千万'},
                                    {value:$scope.preCountList[4], name:'亏损百万'},
                                    {value:$scope.preCountList[5], name:'亏损万'},
                                    {value:$scope.preCountList[7], name:'盈利万'},
                                    {value:$scope.preCountList[8], name:'盈利百万'},
                                    {value:$scope.preCountList[9], name:'盈利千万'},
                                    {value:$scope.preCountList[10], name:'盈利亿'},
                                    {value:$scope.preCountList[11], name:'盈利十亿'},
                                    {value:$scope.preCountList[12], name:'盈利百亿'}
                                ]*/
                            },
                            {
                                name:'面积模式',
                                type:'pie',
                                radius : [30, 110],
                                center : ['75%', 200],
                                roseType : 'area',
                                x: '50%',               // for funnel
                                max: 40,                // for funnel
                                sort : 'ascending',     // for funnel
                                data:dataList
                            }
                        ]
                    },true);
                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                }


			});
