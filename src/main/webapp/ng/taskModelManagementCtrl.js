indexApp
    .controller(
        'taskModelManagementCtrl',
        function($scope, $http, $timeout, $interval) {
            $scope.url = "http://127.0.0.1:3002/";
            $scope.getAllTasks=function () {
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'modelbuildrecord/getallmodelrecord'
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.modelBuildRecordList=resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.showTaskInfo=function(task) {
                $scope.currentTask = task;
                console.log(task);
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'basicmodel/getmodelitem',
                    data:{"modelId":parseInt($scope.currentTask["basicModelId"])}
                }).then(function(resp, status) {
                    console.log("basicModel",resp.data);
                    $scope.basicModelInfo=JSON.stringify(resp.data);
                    var modelInfo=resp.data;
                    $http({
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                        },
                        url : 'modelconfig/getaconfig',
                        data:{"configId":modelInfo["modelDefaultConf"]}
                    }).then(function(resp, status) {
                        console.log("modelConf",resp.data);
                        $scope.modelConfigInfo=JSON.stringify(resp.data);
                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });

                $scope.getCurrentProcess=function(task) {
                    if(task.startTime==null){
                        Swal.fire({
                            title: "预设模型，无法查看建模信息",
                            timer: 4000
                        });
                    }else {
                        document.cookie="taskId="+task.modelUid;
                        document.cookie="showTypeFlag=1";
                        Swal.fire({
                            title: "查看建模进度详情",
                            timer: 2000
                        });
                        $interval(function () {
                            location.href = "modelling.html";
                        }, 1000);
                    }
                }

            };
            /**
             * 删除任务
             *
             */
            $scope.delModel= function (task) {
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
                    if(task.startTime == null){
                        swal.fire({
                            title:"默认模型不可删除",
                            time:2000
                        })
                    }else {
                        if (isConfirm.value) {
                            $http(
                                {
                                    method: 'POST',
                                    url: $scope.url+'delete',
                                    data: {"uid":task.modelUid,"modelName":$scope.currentTask.saveModelName}
                                }).then(function (resp, status) {
                            }, function (resp, status) {
                                $scope.resp = resp;
                                $scope.status = status;
                            });
                            $http(
                                {
                                    method: 'POST',
                                    url: 'modelbuildrecord/delete/',
                                    data: {"modelUid":task.modelUid}
                                }).then(function (resp, status) {
                                $scope.getAllTasks();
                            }, function (resp, status) {
                                $scope.resp = resp;
                                $scope.status = status;
                            });
                        }
                    }
                })
            };
            setInterval(function () {
                $scope.getAllTasks();
            },10000);
        });