indexApp
    .controller(
        'modelConfigCtrl',
        function($scope, $http, $interval, $timeout) {
            $scope.url = "http://127.0.0.1:3002/";
            $scope.selectConfigList = undefined;
            $scope.getModelConfig=function() {
                $http({
                    method : 'GET',
                    url : 'modelconfig/getallconfig'
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.modelConfigList = resp.data;
                    $scope.selectConfigList = JSON.parse(JSON.stringify(resp.data));
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.switchModelConfig=function () {
                var myselect=document.getElementById("configselect");
                var index=myselect.selectedIndex;
                $scope.modelConfig = $scope.modelConfigList[index];
                $scope.modelconfigDescription=$scope.modelConfig['configDescription'];
                $scope.modelConfigMap = JSON.parse($scope.modelConfig['modelConfMap']);
                //$scope.modelConfigMap=JSON.parse($scope.modelConfigMap['modelConfMap']);
                console.log("$scope.modelConfigMap",$scope.modelConfigMap);
                $http({
                    method : 'POST',
                    url : 'textDataSet/getdatasettype',
                    data:{"dataSetType":$scope.modelConfig['modelType']}
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.dataSetList = resp.data;
                    console.log("$scope.dataSetList",$scope.dataSetList);
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.saveConfig=function() {
                var myselect=document.getElementById("dataSetNames");
                var index=myselect.selectedIndex;
                $scope.modelConfig['dataSetName']=$scope.dataSetList[index];
                $scope.modelConfig['configDescription']=$scope.modelconfigDescription;
                console.log("$scope.modelConfigMap",$scope.modelConfigMap);
                $scope.modelConfig['modelConfMap']=JSON.stringify($scope.modelConfigMap);
                console.log("$scope.modelConfig12131",$scope.modelConfig);
                $http({
                    method : 'POST',
                    url : 'modelconfig/insert',
                    data : $scope.modelConfig
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.modelConfig['uid']=resp.data['confUid'];
                    $scope.getModelConfig();
                    swal.fire({
                        title:"已存储配置，编号:"+$scope.modelConfig['uid'],
                        timer:2000
                    })
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            /**
             * 设为默认参数配置，这里目前没有记录在sql的model表中的功能
             * 但为了测试模型结构接口先这样用。
             */
            $scope.setDefaultConfig=function() {
                if($scope.modelConfig['uid'].length<=7){
                    swal.fire({
                        title:"预测模型的参数，无法设置为默认参数",
                        timer:2000
                    })
                }else {
                    $scope.modelConfigMapStr='';
                    $http({
                        method : 'POST',
                        url : 'basicmodel/updateconf',
                        data : {"modelId":$scope.modelConfig['basicModelId'],"confUid":$scope.modelConfig['uid']}
                    }).then(function(resp, status) {
                        console.log(resp);
                        swal.fire({
                            title:$scope.modelConfig["modelName"]+"设置为默认参数",
                            timer:2000
                        })
                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                    //$scope.modelConfig['modelConfMap']=JSON.stringify($scope.modelConfigMap);
                    $scope.modelConfigMapStr=JSON.stringify($scope.modelConfig);
                    console.log("$scope.modelConfigMap2",$scope.modelConfig);
                    $http({
                        method : 'POST',
                        url : $scope.url+'getmodelconstruct',
                        data : $scope.modelConfig
                    }).then(function(resp, status) {
                        console.log(resp);
                        $scope.modelConstruct=resp.data['construct'];
                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                }
            };
            $scope.setLabelInput=function (key,newVaule) {
                console.log(newVaule);
                $scope.modelConfigMap[key]=newVaule;
                console.log("configMap",$scope.modelConfigMap);
            };
        });