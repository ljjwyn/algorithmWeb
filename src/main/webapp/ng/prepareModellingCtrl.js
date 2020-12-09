indexApp
    .controller(
        'prepareModellingCtrl',
        function($scope, $http, $timeout, $interval) {
            $scope.url="http://127.0.0.1:3002/";
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
            $scope.taskId = getCookie("taskId");
            console.log("taskId",$scope.taskId);
            $scope.dataSetName = getCookie("dataSetName");
            console.log("dataSetName",$scope.dataSetName);
            $scope.dataSetCatalog = getCookie("dataSetCatalog");
            console.log("dataSetCatalog",$scope.dataSetCatalog);
            $scope.modelDefaultConfig=undefined;
            $scope.newModelDescription = undefined;
            $scope.newModelName=undefined;
            //$scope.configMap={"batch_size":64,"num_epachs":1,"pad_size":32,"learning_rate":"5e-5","hidden_size":768}
            $scope.setLabelInput=function (key,newVaule) {
                console.log(newVaule);
                $scope.configMap[key]=newVaule;
                console.log("configMap",$scope.configMap);
            };
            $scope.getAlgList=function(){
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : "basicmodel/getmodelid",
                    data : {"modelCatalog":$scope.dataSetCatalog} //$scope.dataSetCatalog
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.algorithmList = resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.changeAlg = function(){
                var myselect=document.getElementById("algorithmSelect");
                var index=myselect.selectedIndex;
                $scope.selectAlg=$scope.algorithmList[index];
                console.log("$scope.selectAlg", $scope.selectAlg);
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : "modelconfig/getaconfig",
                    data : {"configId":$scope.selectAlg['modelDefaultConf']}
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.configMap = JSON.parse(resp.data["modelConfMap"]);
                    $scope.modelDefaultConfig = resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };

            // $scope.getDefaultConf=function(){
            //     $http({
            //         method : 'POST',
            //         headers : {
            //             'Content-Type' : 'application/json',
            //         },
            //         url : "basicmodel/getmodelitem",
            //         data : {"modelId":parseInt($scope.selectAlg.id)} //新增模型的时候注意这个1讲道理要从cookie传值过来哈
            //     }).then(function(resp, status) {
            //         console.log(resp);
            //         $scope.modelInfo = resp.data;
            //         console.log("$scope.modelInfo", $scope.modelInfo);
            //         $http({
            //             method : 'POST',
            //             headers : {
            //                 'Content-Type' : 'application/json',
            //             },
            //             url : "modelconfig/getaconfig",
            //             data : {"configId":$scope.modelInfo['modelDefaultConf']}
            //         }).then(function(resp, status) {
            //             console.log(resp);
            //             $scope.configMap = JSON.parse(resp.data["modelConfMap"]);
            //             console.log("modelDefaultConfig121212121",$scope.modelDefaultConfig);
            //         }, function(resp, status) {
            //             $scope.resp = resp;
            //             $scope.status = status;
            //         });
            //
            //     }, function(resp, status) {
            //         $scope.resp = resp;
            //         $scope.status = status;
            //     });
            // };
            /**
             * 根据不同的任务类型调用模型，这里目前模型id从1开始编号，
             * 第一个是文本分类任务模型，下一步每个任务开发一个模型，最后
             * 每个任务可以多个模型 1为bert文本分类模型
             */
            $scope.startModelling=function () {
                console.log("startModelling_modelDefaultConfig", $scope.modelDefaultConfig);
                $scope.modelDefaultConfig["dataSetName"]=$scope.dataSetName;
                $scope.modelDefaultConfig.modelConfMap=$scope.configMap;
                console.log("$scope.modelDefaultConfig1111",$scope.modelDefaultConfig);
                console.log("JSON.stringify($scope.configMap)",JSON.stringify($scope.configMap));
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url :'modelconfig/updatedatasetname',
                    data : {
                        "confId":$scope.selectAlg['modelDefaultConf'],
                        "dataSetName":$scope.dataSetName,
                        "modelConfMap":JSON.stringify($scope.configMap)
                    }
                }).then(function(resp, status) {
                    console.log(resp.data);
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
                /**
                 * 建模任务信息存数据库
                 * 这要保存各种外键，任务管理里拿外键去查建模数据信息
                 * 获取建模信息有主键依赖关系，这里嵌套调用接口函数。
                 */
                $scope.modelBuildRecord={
                    "modelUid":$scope.taskId,
                    "modelName":$scope.newModelName,
                    "modelDescription":$scope.newModelDescription,
                    "basicModelId":$scope.selectAlg.id.toString(),//目前写死为1也就是bert的文本分类任务,这里涉及int和string的转化，先不动了
                    "modelConfId":$scope.selectAlg['modelDefaultConf']
                };
                $scope.startModelConfig={
                    "uid":$scope.taskId,
                    "method":$scope.selectAlg.methodId,
                    "algorithm":$scope.selectAlg.id,
                    "modelConfMap":$scope.modelDefaultConfig
                };
                console.log("$scope.modelBuildRecord",$scope.modelBuildRecord);
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'modelbuildrecord/insert',
                    data: $scope.modelBuildRecord
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.startModelConfig["saveModelName"]=resp.data["saveModelName"];
                    /**
                     * 开启建模的，6是bert文本分类算法，将跳转到
                     * 建模详情页面。
                     */
                    console.log("$scope.startModelConfig1212121",$scope.startModelConfig);
                    $http({
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                        },
                        url : $scope.url+'startalgorithm',
                        data : $scope.startModelConfig
                    }).then(function(resp, status) {
                        document.cookie="showTypeFlag=0";
                        console.log(resp.data);
                        Swal.fire({
                            title: "建模初始化设置完成！开始建模！",
                            timer: 2000
                        });
                        $interval(function () {
                            location.href = "modelling.html";
                        }, 1000);
                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
            // $scope.startModelling=function() {
            //     $http({
            //         method : 'POST',
            //         headers : {
            //             'Content-Type' : 'application/json',
            //         },
            //         url : "basicmodel/getmodelitem",
            //         data : {"modelId":1}
            //     }).then(function(resp, status) {
            //         console.log(resp);
            //         $scope.modelInfo = resp.data;
            //         console.log("$scope.modelInfo", $scope.modelInfo);
            //         $http({
            //             method : 'POST',
            //             headers : {
            //                 'Content-Type' : 'application/json',
            //             },
            //             url : "modelconfig/getaconfig",
            //             data : {"configId":$scope.modelInfo['modelDefaultConf']}
            //         }).then(function(resp, status) {
            //             console.log(resp);
            //             $scope.modelDefaultConfig = resp.data;
            //             $scope.modelDefaultConfig.dataSetName=$scope.dataSetName;
            //             $scope.modelDefaultConfig.modelConfMap=$scope.configMap;
            //             console.log("$scope.modelDefaultConfig1111",$scope.modelDefaultConfig);
            //             console.log("JSON.stringify($scope.configMap)",JSON.stringify($scope.configMap));
            //             $http({
            //                 method : 'POST',
            //                 headers : {
            //                     'Content-Type' : 'application/json',
            //                 },
            //                 url :'modelconfig/updatedatasetname',
            //                 data : {
            //                     "confId":$scope.modelInfo['modelDefaultConf'],
            //                     "dataSetName":$scope.dataSetName,
            //                     "modelConfMap":JSON.stringify($scope.configMap)
            //                 }
            //             }).then(function(resp, status) {
            //                 console.log(resp.data);
            //             }, function(resp, status) {
            //                 $scope.resp = resp;
            //                 $scope.status = status;
            //             });
            //             /**
            //              * 建模任务信息存数据库
            //              * 这要保存各种外键，任务管理里拿外键去查建模数据信息
            //              * 获取建模信息有主键依赖关系，这里嵌套调用接口函数。
            //              */
            //             $scope.modelBuildRecord={
            //                 "modelUid":$scope.taskId,
            //                 "modelName":$scope.newModelName,
            //                 "modelDescription":$scope.newModelDescription,
            //                 "basicModelId":"1",//目前写死为1也就是bert的文本分类任务,这里涉及int和string的转化，先不动了
            //                 "modelConfId":$scope.modelInfo['modelDefaultConf']
            //             };
            //             $scope.startModelConfig={
            //                 "uid":$scope.taskId,
            //                 "method":6,
            //                 "modelConfMap":$scope.modelDefaultConfig
            //             };
            //             console.log("$scope.modelBuildRecord",$scope.modelBuildRecord);
            //             $http({
            //                 method : 'POST',
            //                 headers : {
            //                     'Content-Type' : 'application/json',
            //                 },
            //                 url : 'modelbuildrecord/insert',
            //                 data: $scope.modelBuildRecord
            //             }).then(function(resp, status) {
            //                 console.log(resp.data);
            //                 $scope.startModelConfig["saveModelName"]=resp.data["saveModelName"];
            //                 /**
            //                  * 开启建模的，6是bert文本分类算法，将跳转到
            //                  * 建模详情页面。
            //                  */
            //                 console.log("$scope.startModelConfig1212121",$scope.startModelConfig);
            //                 $http({
            //                     method : 'POST',
            //                     headers : {
            //                         'Content-Type' : 'application/json',
            //                     },
            //                     url : $scope.url+'startalgorithm',
            //                     data : $scope.startModelConfig
            //                 }).then(function(resp, status) {
            //                     document.cookie="showTypeFlag=0";
            //                     console.log(resp.data);
            //                     Swal.fire({
            //                         title: "建模初始化设置完成！开始建模！",
            //                         timer: 2000
            //                     });
            //                     $interval(function () {
            //                         location.href = "modelling.html";
            //                     }, 1000);
            //                 }, function(resp, status) {
            //                     $scope.resp = resp;
            //                     $scope.status = status;
            //                 });
            //             }, function(resp, status) {
            //                 $scope.resp = resp;
            //                 $scope.status = status;
            //             });
            //
            //         }, function(resp, status) {
            //             $scope.resp = resp;
            //             $scope.status = status;
            //         });
            //         console.log("$scope.modelInfo",$scope.modelInfo);
            //     }, function(resp, status) {
            //         $scope.resp = resp;
            //         $scope.status = status;
            //     });
            //
            // }

        });