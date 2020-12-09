indexApp
    .controller(
        'modellingCtrl',
        function($scope, $http, $timeout, $interval) {
            $scope.url = "http://127.0.0.1:3002/";
            /**
             * 从cookie中获取taskId
             */
            $scope.taskId = "";
            function getCookie(name) {
                var arr=document.cookie.split('; ');
                for(var i = 0 ; i < arr.length; i ++){
                    var arr2=arr[i].split('=');
                    if(arr2[0]==name){
                        return arr2[1];
                    }
                }
                return '';
            }
            $scope.taskId = getCookie("taskId");// 测试用的uuid为"91befff0558740a4a20c2ed51e0efaca";//
            console.log("taskId",$scope.taskId);
            $scope.showTypeFlag = getCookie("showTypeFlag");
            console.log("showTypeFlag",$scope.showTypeFlag);
            $scope.loadSpeed=5000;
            $scope.trainInfoStr = '';
            $scope.recallAndF1 = '';
            $scope.processLoss =null;
            $scope.trainAcc = null;
            $scope.batchId=null;
            $scope.batchIdList=null;
            $scope.trainTime=null;
            $scope.totalBatch=0;
            $scope.LossList=[];
            $scope.accList=[];
            $scope.batchIdList=[];
            $scope.processList=[];
            $scope.speedModes=["极快","快","中","慢","极慢"];
            $scope.speedFlag = 0;
            $scope.switchSpeed=function () {
                var myselect=document.getElementById("speedSet");
                var index=myselect.selectedIndex;
                if(index==0){
                    $scope.loadSpeed=100;
                    $scope.speedFlag = 1;
                }else if(index==1){
                    $scope.loadSpeed=500;
                    $scope.speedFlag = 1;
                }else if(index==2){
                    $scope.loadSpeed=1000;
                    $scope.speedFlag = 1;
                }else if(index==3){
                    $scope.loadSpeed=5000;
                    $scope.speedFlag = 1;
                }else if(index==4){
                    $scope.loadSpeed=10000;
                    $scope.speedFlag = 1;
                }
                Swal.fire({
                    title:"速度切换",
                    timer:2000
                });
            };
            function getCurrentProcess(flag) {
                $http({
                    method : 'POST',
                    url : $scope.url+"getcurrentprocess",
                    data : {"uid":$scope.taskId}
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.processList=resp.data["processList"];
                    for(var i = 0; i < $scope.processList.length; i++){
                        if($scope.processList[i]["batchId"]!=undefined){
                            if($scope.processList[i]["batchId"]==-1){
                                $scope.trainInfoStr+="建模完成,"+"总用时："+$scope.processList[i]["totalTime"];
                                $http({
                                    method : 'POST',
                                    headers : {
                                        'Content-Type' : 'application/json',
                                    },
                                    url : 'modelbuildrecord/updateendtime',
                                    data : {"modelUid":$scope.taskId}
                                }).then(function(resp, status) {
                                    console.log(resp.data);
                                }, function(resp, status) {
                                    $scope.resp = resp;
                                });
                                // if(flag==1){
                                //     Swal.fire({
                                //         title: "建模完成,"+"总用时："+$scope.processList[i]["totalTime"],
                                //         timer: 2000
                                //     });
                                // }
                                break;
                            }else {
                                $scope.batchIdList.push(i);
                                $scope.LossList.push($scope.processList[i]["loss"]);
                                $scope.accList.push($scope.processList[i]["train_acc"]);
                                $scope.processLoss = $scope.processList[i]["loss"];
                                $scope.trainAcc = $scope.processList[i]["train_acc"];
                                $scope.trainTime=$scope.processList[i]["time"];
                                $scope.trainInfoStr+="第 "+$scope.processList[i]["batchId"]+" 训练批次，训练损失--->"+
                                    $scope.processLoss+",训练集准确率--->"+$scope.trainAcc+",训练耗时--->" +
                                    $scope.trainTime+"\n";
                                console.log("recall", $scope.processList[i]["recall"]);
                                if($scope.processList[i]["recall"]!=null){
                                    $scope.recallAndF1+="第 "+$scope.batchId+" 训练批次，召回率--->"+
                                        $scope.processList[i]["recall"]+",F1--->"+$scope.processList[i]["f1"]+"\n";
                                }else {
                                    $scope.recallAndF1 = "没有召回率和F1";
                                }
                            }
                        }else {
                            console.log("模型未更新过+1")
                        }

                    }
                    console.log("$scope.LossList",$scope.LossList);
                    console.log("$scope.accList",$scope.accList);
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
            function getTotalBatch() {
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'gettotalbatch',
                    data : {"uid":$scope.taskId}
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.totalBatch=resp.data ["totalBatch"];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
            var tempIdList = [99999999,99999998];
            function getPreprocessItem(flag) {
                if(flag==0){
                    $http({
                        method : 'POST',
                        url : $scope.url+"getpreprocessitem",
                        data : {"uid":$scope.taskId}
                    }).then(function(resp, status) {
                        console.log(resp);
                        if($scope.batchId==0){
                            getTotalBatch();
                        }
                        $scope.batchId=resp.data["batchId"];
                        if($scope.batchId!=null){
                            tempIdList.push($scope.batchId);
                        }
                        console.log("tempIdList",tempIdList);
                        var lenths = tempIdList.length;
                        console.log(tempIdList[lenths-1],tempIdList[lenths-2]);
                        if(tempIdList[lenths-2]!=tempIdList[lenths-1]){
                            console.log("batchId_null_test",$scope.batchId);
                            if($scope.batchId!=undefined){
                                if($scope.batchId==-1){
                                    $scope.trainInfoStr+="建模完成,"+"总用时："+resp.data["totalTime"];
                                    $http({
                                        method : 'POST',
                                        headers : {
                                            'Content-Type' : 'application/json',
                                        },
                                        url : 'modelbuildrecord/updateendtime',
                                        data : {"modelUid":$scope.taskId}
                                    }).then(function(resp, status) {
                                        console.log(resp.data);
                                    }, function(resp, status) {
                                        $scope.resp = resp;
                                        $scope.status = status;
                                    });
                                    // $http({
                                    //     method : 'POST',
                                    //     headers : {
                                    //         'Content-Type' : 'application/json',
                                    //     },
                                    //     url : 'modelbuildrecord/updateprocess',
                                    //     data : {"modelUid":$scope.taskId,"process":1.0000}
                                    // }).then(function(resp, status) {
                                    //     console.log(resp.data);
                                    // }, function(resp, status) {
                                    //     $scope.resp = resp;
                                    //     $scope.status = status;
                                    // });
                                    Swal.fire({
                                        title: "建模完成,"+"总用时："+resp.data["totalTime"],
                                        timer: 2000
                                    });
                                }else {
                                    $scope.processLoss = resp.data["loss"];
                                    $scope.trainAcc = resp.data["train_acc"];
                                    $scope.trainTime=resp.data["time"];
                                    $scope.trainInfoStr+="第 "+$scope.batchId+" 训练批次，训练损失--->"+
                                        $scope.processLoss+",训练集准确率--->"+$scope.trainAcc+",训练耗时--->" +
                                        $scope.trainTime+"\n";
                                    if(resp.data["recall"]!=null){
                                        $scope.recallAndF1+="第 "+$scope.batchId+" 训练批次，召回率--->"+
                                            resp.data["recall"]+",F1--->"+resp.data["f1"]+"\n";
                                    }else {
                                        $scope.recallAndF1 = "没有召回率和F1";
                                    }
                                    // var currentProcess=$scope.batchId/$scope.totalBatch;
                                    // currentProcess = currentProcess.toFixed(4);
                                    // console.log("process",currentProcess);
                                    // $http({
                                    //     method : 'POST',
                                    //     headers : {
                                    //         'Content-Type' : 'application/json',
                                    //     },
                                    //     url : 'modelbuildrecord/updateprocess',
                                    //     data : {"modelUid":$scope.taskId,"process":currentProcess}
                                    // }).then(function(resp, status) {
                                    //     console.log(resp.data);
                                    // }, function(resp, status) {
                                    //     $scope.resp = resp;
                                    //     $scope.status = status;
                                    // });
                                    console.log("$scope.trainInfoStr", $scope.trainInfoStr);
                                }
                            }else{
                                console.log("id is null");
                            }
                            console.log("getPreprocessItem", $scope.batchId);
                        }

                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                }else {
                    console.log("只更新一次就行");
                }
            };

            // var now = +new Date(1997, 9, 3);
            // var oneDay = 24 * 3600 * 1000;
            // var value = Math.random() * 1000;
            // for (var i = 0; i < 100; i++) {
            //     data.push(randomData());
            // }
            $scope.linerChart = function (chart,title,flag){
                var data = [];
                var Xaxis = [];
                var data1 = [];
                var Xaxis1 = [];
                // 指定图表的配置项和数据
                echarts.init(document.getElementById(chart),'dark').dispose();
                var option = {
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        name:'batch',
                        type: 'category',
                        splitLine: {
                            show: false
                        },
                        data:Xaxis
                    },
                    yAxis: {
                        name:title,
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: title,
                        type: 'line',
                        showSymbol: true,
                        hoverAnimation: true,
                        data: data
                    }]
                };

                var echartsWarp = document.getElementById(chart);
                var myChart = echarts.init(echartsWarp);// 基于准备好的dom，初始化echarts实例
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                if($scope.showTypeFlag==1){
                    if(flag==0){
                        getCurrentProcess(1);
                    }
                    var interval1 = setInterval(loadAll, 10);
                    var interval2 = setInterval(intervalLoad, $scope.loadSpeed);
                    function loadAll() {
                        //getCurrentProcess(0);
                        var textarea = document.getElementById('trainInfoText');
                        textarea.scrollTop = textarea.scrollHeight;
                        if(flag==0){
                            Xaxis=$scope.batchIdList;
                            data=$scope.LossList;
                            console.log("Xaxis",Xaxis);
                            console.log("data",data);
                            myChart.setOption({
                                xAxis: {
                                    data:Xaxis
                                },
                                series: [{
                                    data: data
                                }]
                            });
                        }else if(flag==1){
                            Xaxis1=$scope.batchIdList;
                            data1=$scope.accList;
                            myChart.setOption({
                                yAxis: {
                                    max:1
                                }
                            });
                            console.log("Xaxis1",Xaxis1);
                            console.log("data1",data1);
                            myChart.setOption({
                                xAxis: {
                                    data:Xaxis1
                                },
                                series: [{
                                    data: data1
                                }]
                            });
                        }
                        clearInterval(interval1);
                    }
                    function intervalLoad() {
                        if($scope.speedFlag==1){
                            clearInterval(interval2);
                            if(flag==1){
                                $scope.speedFlag=0;
                            }
                            interval2 = setInterval(intervalLoad, $scope.loadSpeed);
                        }
                        if($scope.batchId==-1){
                            if(flag==0&&$scope.batchId!=null){
                                console.log("Xaxis-0",Xaxis);
                                console.log("data-0",data);
                                myChart.setOption({
                                    xAxis: {
                                        data:Xaxis
                                    },
                                    series: [{
                                        data: data
                                    }]
                                });
                            }else if(flag==1&&$scope.batchId!=null){
                                //Xaxis1.push($scope.batchId);
                                myChart.setOption({
                                    yAxis: {
                                        max:1
                                    }
                                });
                                console.log("Xaxis-1",Xaxis1);
                                console.log("data-1",data1);
                                myChart.setOption({
                                    xAxis: {
                                        data:Xaxis1
                                    },
                                    series: [{
                                        data: data1
                                    }]
                                });
                            }
                            clearInterval(interval2);
                        }else{
                            var lenths = tempIdList.length;
                            if(tempIdList[lenths-2]!=tempIdList[lenths-1]){
                                console.log($scope.batchId);
                                var textarea = document.getElementById('trainInfoText');
                                textarea.scrollTop = textarea.scrollHeight;
                                if(flag==0&&$scope.batchId!=null){
                                    Xaxis.push($scope.batchId);
                                    data.push($scope.processLoss);
                                    console.log("Xaxis 0",Xaxis);
                                    console.log("data 0",data);
                                    myChart.setOption({
                                        xAxis: {
                                            data:Xaxis
                                        },
                                        series: [{
                                            data: data
                                        }]
                                    });
                                }else if(flag==1&&$scope.batchId!=null){
                                    //Xaxis1.push($scope.batchId);
                                    data1.push($scope.trainAcc);
                                    myChart.setOption({
                                        yAxis: {
                                            max:1
                                        }
                                    });
                                    console.log("Xaxis 1",Xaxis1);
                                    console.log("data 1",data1);
                                    myChart.setOption({
                                        xAxis: {
                                            data:Xaxis1
                                        },
                                        series: [{
                                            data: data1
                                        }]
                                    });
                                }
                            }
                            getPreprocessItem(flag);
                        }
                        if($scope.batchId==null){
                            console.log("建模未更新");
                        }
                    }
                }
                if($scope.showTypeFlag==0) {
                    var interval = setInterval(getModellingData, $scope.loadSpeed);
                    function getModellingData() {
                        //重启计时器用来更改刷新速度
                        if($scope.speedFlag==1){
                            clearInterval(interval2);
                            if(flag==1){
                                $scope.speedFlag=0;
                            }
                            interval = setInterval(intervalLoad, $scope.loadSpeed);
                        }
                        console.log("batchId_test2",$scope.batchId);
                        if($scope.batchId==-1){
                            clearInterval(interval);
                        }else{
                            var lenths = tempIdList.length;
                            if(tempIdList[lenths-2]!=tempIdList[lenths-1]){
                                console.log("getPreprocessItemhoubian",$scope.batchId);
                                var textarea = document.getElementById('trainInfoText');
                                textarea.scrollTop = textarea.scrollHeight;
                                if(flag==0&&$scope.batchId!=null){
                                    Xaxis.push($scope.batchId);
                                    console.log("flag==0",$scope.batchId);
                                    data.push($scope.processLoss);
                                    console.log("Xaxis",Xaxis);
                                    console.log("data",data);
                                    myChart.setOption({
                                        xAxis: {
                                            data:Xaxis
                                        },
                                        series: [{
                                            data: data
                                        }]
                                    });
                                }else if(flag==1&&$scope.batchId!=null){
                                    console.log("flag==1",$scope.batchId);
                                    Xaxis1.push($scope.batchId);
                                    data1.push($scope.trainAcc);
                                    console.log("Xaxis1",Xaxis);
                                    console.log("data1",data);
                                    myChart.setOption({
                                        yAxis: {
                                            max:1
                                        }
                                    });
                                    myChart.setOption({
                                        xAxis: {
                                            data:Xaxis1
                                        },
                                        series: [{
                                            data: data1
                                        }]
                                    });
                                }
                            }
                            getPreprocessItem(flag);
                        }
                        if($scope.batchId==null){
                            console.log("建模未更新");
                        }
                    }
                }
                window.addEventListener("resize", function () {
                    myChart.resize();
                });

            };
            $scope.linerChart('modelLossChart','损失',0);
            $scope.linerChart('modelAccChart','准确率',1);
        });