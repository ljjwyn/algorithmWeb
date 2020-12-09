indexApp
    .controller(
        'uploadFilesCtrl',
        function($scope, $http, $timeout, $interval) {
            $scope.taskCatalogs=["数值分类","文本分类","命名实体识别","关系抽取"];
            $scope.dataDescription="";
            $scope.dataName="";
            $scope.url="http://127.0.0.1:3002/";
            $scope.recordDataSet=function () {
                var myselect=document.getElementById("taskselect");
                var index=myselect.selectedIndex;
                $scope.dataSetRecord={
                    "dataSetName":$scope.dataName,
                    "dataSetDescription":$scope.dataDescription,
                    "dataSetCatalog":$scope.taskCatalogs[index]
                };
                console.log("$scope.dataSetRecord",$scope.dataSetRecord);
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'textDataSet/insert',
                    data : $scope.dataSetRecord
                }).then(function(resp, status) {
                    $scope.getAllDataSet();
                    console.log(resp.data);
                    var infos = resp.data["countInfo"];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.getAllDataSet=function () {
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'textDataSet/getalldataset'
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.dataSetList = resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.showDataSetInfo=function (dataSet) {
                $scope.currentDataSet=dataSet;
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+"getsubfile",
                    data : {"dataSetName":dataSet.dataSetName}
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.subFileList = resp.data["dataSetList"];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.showFileContent=function () {
                var myselect=document.getElementById("fileselect");
                var index=myselect.selectedIndex;
                $scope.selectedFileName=myselect.options[index].text;
                console.log("$scope.selectedFileName",$scope.selectedFileName);
                if($scope.selectedFileName){
                    $http({
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                        },
                        url : $scope.url+"getfilecontent",
                        data : {"dataSetName":$scope.currentDataSet.dataSetName,
                            "fileName":$scope.selectedFileName}
                    }).then(function(resp, status) {
                        console.log(resp);
                        $scope.fileContents = resp.data["contents"];
                        console.log("$scope.readme",$scope.readme);
                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                }else {
                    $scope.fileContents = "";
                }
            };
            $scope.delDataSet= function (dataSet) {
                console.log("[DELETE TASK] You are deletting the task whose id is "
                    + dataSet.id);
                swal({
                    title: '确认删除该数据集',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(function(isConfirm) {
                    console.log("ic",isConfirm);
                    if(dataSet.createTime == null){
                        swal.fire({
                            title:"默认数据集不可删除",
                            time:2000
                        })
                    }else {
                        if (isConfirm.value) {
                            $http(
                                {
                                    method: 'POST',
                                    url: $scope.url+'deleteDataSet',
                                    data: {"dataSetName":dataSet.dataSetName}
                                }).then(function (resp, status) {
                            }, function (resp, status) {
                                $scope.resp = resp;
                                $scope.status = status;
                            });
                            $http(
                                {
                                    method: 'POST',
                                    url: 'textDataSet/delete/',
                                    data: {"id":parseInt(dataSet.id)}
                                }).then(function (resp, status) {
                                $scope.getAllDataSet();
                            }, function (resp, status) {
                                $scope.resp = resp;
                                $scope.status = status;
                            });
                        }
                    }
                })
            };
        });