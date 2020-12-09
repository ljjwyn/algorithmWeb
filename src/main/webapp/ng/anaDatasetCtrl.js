indexApp
    .controller(
        'anaDatasetCtrl',
        function($scope, $http, $interval, $timeout) {
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

            /**
             * 数据库信息
             */
            $scope.dbInfoList = [];
            $scope.tableList = [];
            $scope.currentDBName = "";
            $scope.currentTableName = "";
            $scope.currentTableInfo = null;
            $scope.selectedDBAndTables = [];


            $scope.SQLshow=false;
            $scope.TXTshow=false;
            $scope.otherDataShow=false;
            /**
             * 获取所有主题库名
             */
            $scope.getAllSubjectDBs = function() {
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'MySQLManager/mysql/v2/dataset/dbs',
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.status = status;
                    $scope.dbInfoList=resp.data.subjectDBs;

                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };


            /**
             * 查询MySQL数据库中所有表
             */
            var listMySQLTables = $scope.listMySQLTables = function() {
                $scope.mysqlDbInfoVisible = true;

                var apiMySQLTables = 'MySQLManager/mysql/v2/tables';

                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : apiMySQLTables,
                    data : {"dbName": $scope.currentDBName},
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.tableList = resp.data["data"];

                    $scope.currentTableName = $scope.tableList[0].name;
                    showTableInfo();
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }



            /**
             * 显示表相关信息
             */
            var showTableInfo = $scope.showTableInfo = function () {

                /**
                 * 获取表的列头信息
                 */
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'MySQLManager/mysql/v2/column-info',
                    data : {"dbName": $scope.currentDBName, "tableName": $scope.currentTableName},
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.currentTableInfo = resp.data["data"];

                    getMySQLTableSampleData();

                    getMySQLTableDesc();

                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };



            /**
             * 显示MySQL数据库中某表的结构
             */
            var getMySQLTableDesc = $scope.getMySQLTableDesc = function() {
                $scope.sqlUserDefinedTableDataVisible = false;
                $scope.mysqlDbTableInfoVisible = true;
            }



            /**
             * MySQL数据源配置对象
             */
            var mysqlConfig = $scope.mysqlConfig = {
                ip : "127.0.0.1",
                port : "3306",
                dbName : "",
                username : "root",
                password : "root"
            };

            /**
             * 查询MySQL数据库中某表查询样例（接口只返回5行样例数据）
             */
            var getMySQLTableSampleData = $scope.getMySQLTableSampleData = function() {

                var apiMySQLTableSampleData = 'MySQLManager/mysql/select';

                mysqlConfig["sql"] = "SELECT * FROM " + $scope.currentTableName;

                mysqlConfig.dbName = $scope.currentDBName;

                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : apiMySQLTableSampleData,
                    data : mysqlConfig,
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.mysqlTableSampleData = resp.data["data"];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }

            $scope.addATableToSelected = function () {

                function getTextOfSelectedOption(elementId) {
                    var myselect=document.getElementById(elementId);
                    var index=myselect.selectedIndex;
                    return myselect.options[index].text;
                }

                $scope.selectedDBAndTables.push({
                    "dbName": $scope.currentDBName,
                    "dbComment": getTextOfSelectedOption("dbSelect"),
                    "tableName": $scope.currentTableName,
                    "tableComment":getTextOfSelectedOption("tableSelect")
                });

            };

            $scope.delSelectedDBAndTables = function (i) {
                $scope.selectedDBAndTables.splice(i, 1);
            };

            /**
             * 查询MySQL数据库中某表查询样例（接口只返回5行样例数据）
             */
            $scope.submitConfig = function() {

                Swal({
                    title: "正在构建数据集......",
                    showConfirmButton: false,
                    showCancelButton: false,
                    showLoaderOnConfirm: true,
                });

                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : "analysis/dataset/config",
                    data : {"taskId": $scope.taskId,
                            "datasets": $scope.selectedDBAndTables},
                }).then(function(resp, status) {
                    Swal.close();
                    console.log("resp.data.message", resp.data.message);
                    if (resp.data.message !== undefined && resp.data.message !== "" ) {
                        Swal.fire(resp.data.message);
                    } else {
                        Swal.fire({
                            title: '完成！',
                            timer: 2000
                        });

                        document.cookie="taskId="+$scope.taskId;
                        // TODO 跳转到预处理页面
                        /*$interval(function () {
                            location.href = "MLdataPRE.html";
                        }, 1000);*/
                    }


                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.predictstart=function () {
                window.location=encodeURI("MLdataPRE.html");
            };
            $scope.start=function () {
                window.location=encodeURI("predictPRE.html");
            };


            $scope.getDataSetList=function () {
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'textDataSet/getalldataset'
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.resultList = resp.data;
                    $scope.dataSetNameList = [];
                    $scope.readmeList = [];
                    $scope.dataSetCatalogList=[];
                    for (var i = 0; i < $scope.resultList.length; i++) {
                        $scope.dataSetNameList.push($scope.resultList[i]["dataSetName"]);
                        $scope.readmeList.push($scope.resultList[i]["dataSetDescription"]);
                        $scope.dataSetCatalogList.push($scope.resultList[i]["dataSetCatalog"]);
                    }
                    //$scope.dataSetNameList = resp.data["dataSetList"];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.getSubFileName=function () {
                var myselect=document.getElementById("datadirselect");
                var index=myselect.selectedIndex;
                $scope.readme=$scope.readmeList[index];
                $scope.dataSetCatalog=$scope.dataSetCatalogList[index];
                $scope.selectedDataSetName=myselect.options[index].text;
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+"getsubfile",
                    data : {"dataSetName":$scope.selectedDataSetName}
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.subFileList = resp.data["dataSetList"];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
                // $http({
                //     method : 'POST',
                //     headers : {
                //         'Content-Type' : 'application/json',
                //     },
                //     url : $scope.url+"getreadme",
                //     data : {"dataSetName":$scope.selectedDataSetName}
                // }).then(function(resp, status) {
                //     console.log(resp);
                //     $scope.readme = resp.data["readme"];
                // }, function(resp, status) {
                //     $scope.resp = resp;
                //     $scope.status = status;
                // });
                console.log("$scope.selectedDataSetName",$scope.selectedDataSetName);
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
                        data : {"dataSetName":$scope.selectedDataSetName,
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
            $scope.dataClassifyShow=false;
            $scope.textClassifyShow=false;
            $scope.isPreTrain = ["数据集自构建","BERT预处理模型"];
            $scope.preprocessing=function () {
                var index=0;
                var myselect=document.getElementById("pretrain");
                index=myselect.selectedIndex;
                $scope.pretraintype = $scope.isPreTrain[index];
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+"preprocessing",
                    data : {"dataSetName":$scope.selectedDataSetName,
                        "dataSetCatalog":$scope.dataSetCatalog,
                    "ispretrainmodel":index}
                }).then(function(resp, status) {
                    console.log(resp);
                    if($scope.dataSetCatalog=="文本分类"||$scope.dataSetCatalog=="命名实体识别"
                        ||$scope.dataSetCatalog=="关系抽取"){
                        $scope.labelstr = resp.data["labelstr"];
                        $scope.dataSetClass = resp.data["dataSetClass"];
                        $scope.dataClassifyShow=false;
                        $scope.textClassifyShow=true;
                    }else if($scope.dataSetCatalog=="数值分类"){
                        $scope.dataSetTitle=resp.data["title"];
                        $scope.dataSetX=resp.data["X"];
                        $scope.dataSetY=resp.data["Y"];
                        $scope.dataSetXLen=[];
                        var dataLenth=$scope.dataSetX.length;
                        for (var i = 0; i < dataLenth;i++){
                            $scope.dataSetXLen.push(i);
                        }
                        $scope.dataClassifyShow=true;
                        $scope.textClassifyShow=false;
                    }
                    console.log("resp.data",resp.data);
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.modellingConfig=function() {
                document.cookie="dataSetName="+$scope.selectedDataSetName;
                document.cookie="dataSetCatalog="+$scope.dataSetCatalog;
                $interval(function () {
                    location.href = "prepareModelling.html";
                }, 1000);
            }



        });
