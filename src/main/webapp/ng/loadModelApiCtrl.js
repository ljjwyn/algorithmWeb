indexApp
    .controller(
        'loadModelApiCtrl',
        function($scope, $http, $interval, $timeout) {
            $scope.url = "http://127.0.0.1:3002/";
            $scope.loadReady=false;
            $scope.getModelList=function () {
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : 'modelbuildrecord/getallmodelrecord'
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.createModelList=resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            // 根据不同任务类型分类展示
            $scope.textClassifyTaskShow=false;
            $scope.nerTaskShow=false;
            $scope.reTaskShow=false;
            $scope.inputShow=true;
            $scope.preLoadModel=function () {
                var myselect=document.getElementById("createModelSelect");
                var index=myselect.selectedIndex;
                $scope.currentModel=$scope.createModelList[index];
                Swal({
                    title: "正在预加载模型......",
                    showConfirmButton: false,
                    showCancelButton: false,
                    showLoaderOnConfirm: true,
                });
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : "modelconfig/getaconfig",
                    data : {"configId":$scope.currentModel.modelConfId}
                }).then(function(resp, status) {
                    console.log(resp);
                    $scope.dataSetName = resp.data["dataSetName"];
                    $scope.modelConfMap=resp.data["modelConfMap"];
                    document.getElementById("dataSetName").value=$scope.dataSetName;
                    if($scope.currentModel["basicModelId"]>=7){
                        //$scope.getEntity();
                        $scope.inputShow=false;
                        $scope.textClassifyTaskShow=false;
                        $scope.nerTaskShow=false;
                        $scope.reTaskShow=true;
                        swal.close();
                        Swal.fire({
                            title: "上传预测数据集",
                            timer: 2000
                        });
                    }else {
                        $http({
                            method : 'POST',
                            headers : {
                                'Content-Type' : 'application/json',
                            },
                            url : $scope.url+'startpredictmodel',
                            data:{
                                    "modelName":$scope.currentModel.saveModelName,
                                    "dataSetName":$scope.dataSetName,
                                    "modelConfMap":$scope.modelConfMap,
                                    "algorithm":$scope.currentModel.basicModelId
                            }
                        }).then(function(resp, status) {
                            console.log(resp.data);
                            swal.close();
                            Swal.fire({
                                title: "模型预加载完成",
                                timer: 2000
                            });
                            $scope.loadReady=true;
                        }, function(resp, status) {
                            $scope.resp = resp;
                            $scope.status = status;
                        });
                    }
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.stopModel=function(){
                $scope.textClassifyTaskShow=false;
                $scope.nerTaskShow=false;
                $scope.reTaskShow=false;
                $scope.inputShow=true;
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'stopmodel'
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.currentModel=undefined;
                    $scope.labelStr=undefined;
                    Swal.fire({
                        title: "预加载模型已清空",
                        timer: 2000
                    });
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            // 测试用不传参数值获取构建前端可视化知识图谱的数据集
            $scope.getEntity=function(){
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'getentitys'
                }).then(function(resp, status) {
                    console.log(resp.data);
                    var entityList=resp.data["entityList"];
                    var relationList=resp.data["relationList"];
                    var categories=resp.data["categories"];
                    $scope.entityMapsList=[];
                    $scope.relationList=[];
                    $scope.categoriesList=[];
                    for(var i=0;i<categories.length;i++){
                        var tempMap = {
                            "name":categories[i]
                        };
                        $scope.categoriesList.push(tempMap);
                    }
                    for(var i=0;i<entityList.length;i++){
                        var tempMap = {
                            "name":entityList[i]["entity"],
                            "des":entityList[i]["entity"],
                            "symbolSize": 50,
                            "category":entityList[i]["entity_type"]
                        };
                        $scope.entityMapsList.push(tempMap);
                    }
                    for(var j=0;j<relationList.length;j++){
                        var tempMap = {
                            "source":relationList[j]["entity1"],
                            "target":relationList[j]["entity2"],
                            "name": relationList[j]["relation"],
                            "des":relationList[j]["relation"]
                        };
                        $scope.relationList.push(tempMap);
                    }
                    console.log("$scope.graphInfo",$scope.graphInfo);
                    console.log("categoriesList",$scope.categoriesList);
                    console.log("entityMapsList",$scope.entityMapsList);
                    console.log("$scope.relationList",$scope.relationList);
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.searchEntity='';
            $scope.searchDB=function(){
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'searchentity',
                    data:{
                        "content":$scope.searchEntity
                    }
                }).then(function(resp, status) {
                    echarts.init(document.getElementById('knowledgeGraph')).dispose();
                    console.log(resp.data);
                    if(resp.data['state']==1){
                        var entityList=resp.data["entityList"];
                        var relationList=resp.data["relationList"];
                        var categories=resp.data["categories"];
                        $scope.entityMapsList=[];
                        $scope.relationList=[];
                        $scope.categoriesList=[];
                        $scope.graphInfo="实体关系详情\n";
                        $scope.graphInfo+="实体属性：\n";
                        for(var i=0;i<categories.length;i++){
                            var tempMap = {
                                "name":categories[i]
                            };
                            $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                            $scope.categoriesList.push(tempMap);
                        }
                        $scope.graphInfo+="实体列表：\n";
                        for(var i=0;i<entityList.length;i++){
                            if(entityList[i]["entity"]==$scope.searchEntity){
                                var tempMap = {
                                    "name":entityList[i]["entity"],
                                    "des":entityList[i]["entity"],
                                    "symbolSize": 80,
                                    "category":entityList[i]["entity_type"]
                                };
                            }else {
                                var tempMap = {
                                    "name":entityList[i]["entity"],
                                    "des":entityList[i]["entity"],
                                    "symbolSize": 50,
                                    "category":entityList[i]["entity_type"]
                                };
                            }
                            $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                            $scope.entityMapsList.push(tempMap);
                        }
                        $scope.graphInfo+="关系列表：\n";
                        for(var j=0;j<relationList.length;j++){
                            var tempMap = {
                                "source":relationList[j]["entity1"],
                                "target":relationList[j]["entity2"],
                                "name": relationList[j]["relation"],
                                "des":relationList[j]["relation"]
                            };
                            $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                            $scope.relationList.push(tempMap);
                        }
                        console.log("categoriesList",$scope.categoriesList);
                        console.log("entityMapsList",$scope.entityMapsList);
                        console.log("$scope.relationList",$scope.relationList);
                        $scope.getKnowledgeGraph();
                    }else {
                        swal.fire({
                            title:"查无此实体！",
                            timer:2000
                        })
                    }
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.showKnowledgeGraph=function(){
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'getentitys',
                    data:{
                        "uid":$scope.currentModel.modelUid,
                        "modelName":$scope.currentModel.saveModelName,
                        "dataSetName":$scope.dataSetName,
                        "modelConfMap":$scope.modelConfMap,
                        "algorithm":$scope.currentModel.basicModelId
                    }
                }).then(function(resp, status) {
                    echarts.init(document.getElementById('knowledgeGraph')).dispose();
                    console.log(resp.data);
                    var entityList=resp.data["entityList"];
                    var relationList=resp.data["relationList"];
                    var categories=resp.data["categories"];
                    $scope.entityMapsList=[];
                    $scope.relationList=[];
                    $scope.categoriesList=[];
                    $scope.graphInfo="实体关系详情\n";
                    $scope.graphInfo+="实体属性：\n";
                    for(var i=0;i<categories.length;i++){
                        var tempMap = {
                            "name":categories[i]
                        };
                        $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                        $scope.categoriesList.push(tempMap);
                    }
                    $scope.graphInfo+="实体列表：\n";
                    for(var i=0;i<entityList.length;i++){
                        var tempMap = {
                            "name":entityList[i]["entity"],
                            "des":entityList[i]["entity"],
                            "symbolSize": 50,
                            "category":entityList[i]["entity_type"]
                        };
                        $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                        $scope.entityMapsList.push(tempMap);
                    }
                    $scope.graphInfo+="关系列表：\n";
                    for(var j=0;j<relationList.length;j++){
                        var tempMap = {
                            "source":relationList[j]["entity1"],
                            "target":relationList[j]["entity2"],
                            "name": relationList[j]["relation"],
                            "des":relationList[j]["relation"]
                        };
                        $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                        $scope.relationList.push(tempMap);
                    }
                    console.log("categoriesList",$scope.categoriesList);
                    console.log("entityMapsList",$scope.entityMapsList);
                    console.log("$scope.relationList",$scope.relationList);
                    $scope.getKnowledgeGraph();
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.startPredict=function () {
                $scope.inputSentencesIndex=[];
                $scope.sentenceLabel=[];
                $scope.pieDataList=[];
                console.log("input",$scope.inputSentences);
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'predictinputs',
                    data:{"sentence":$scope.inputSentences}
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.labelStr='';
                    $scope.resList = resp.data["result"];
                    var taskType=$scope.resList[0]["taskType"];
                    $scope.inputSentencesIndex=[];
                    if(taskType=="textClassify"){
                        for( var i = 0; i< $scope.resList.length; i++){
                            $scope.inputSentencesIndex.push(i);
                            $scope.labelStr+="预测标签结果: "+$scope.resList[i].predictLabel+"\n";
                            console.log("$scope.labelStr", $scope.labelStr);
                        }
                        $scope.textClassifyTaskShow=true;
                        $scope.nerTaskShow=false;
                    }else if(taskType=="NER"){
                        $scope.colorList=[];
                        $scope.indexList=[];
                        $scope.tokenList=[];
                        $scope.entitiesList=[];
                        $scope.sentenceCount=[];
                        for(var num=0;num<$scope.resList.length;num++){
                            $scope.sentenceCount.push(num);
                            $scope.labelStr+="预测标签结果: "+$scope.resList[num].labels+"\n";
                            console.log("$scope.labelStr", $scope.labelStr);
                            $scope.tokenList.push($scope.resList[num]["sentence"]);
                            $scope.entitiesList.push($scope.resList[num]["labels"]);
                            var tempColorList=[];
                            var tempIndexList=[];
                            for(var j=0;j<$scope.entitiesList[num].length;j++){
                                tempIndexList.push(j);
                                if($scope.entitiesList[num][j]!='O'){
                                    var tempLabel=$scope.entitiesList[num][j].slice(-3);
                                    console.log("tempLabel",tempLabel);
                                    if(tempLabel=='ORG'){
                                        tempColorList.push("red");
                                    }else if(tempLabel=='LOC'){
                                        tempColorList.push("blue");
                                    }else if(tempLabel=='PER'){
                                        tempColorList.push("green");
                                    }
                                }else {
                                    tempColorList.push("black");
                                }
                                console.log("tempColorList",tempColorList);
                            }
                            $scope.colorList.push(tempColorList);
                            $scope.indexList.push(tempIndexList);
                        }
                        $scope.textClassifyTaskShow=false;
                        $scope.nerTaskShow=true;
                    }
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.selectInputSentence = function(){
                var myselect=document.getElementById("inputSentences");
                var index=myselect.selectedIndex;
                $scope.sentenceScore=$scope.resList[index].score;
                $scope.sentenceLabel=$scope.resList[index].labels;
                $scope.selectSentence="预测原句："+$scope.resList[index].sentence;
                $scope.pieDataList=[];
                for(var i=0;i<$scope.sentenceLabel.length;i++){
                    var tempMap={};
                    tempMap["value"]=$scope.sentenceScore[i];
                    tempMap["name"]=$scope.sentenceLabel[i];
                    $scope.pieDataList.push(tempMap);
                }
                console.log("$scope.sentenceLabel",$scope.sentenceLabel);
                console.log("$scope.pieDataList",$scope.pieDataList);
                $scope.getPredictLabelsPie();
                $scope.getPredictLabelsWords();
            };
            //echart画图
            $scope.getKnowledgeGraph=function(){
                var myChart = echarts.init(document.getElementById('knowledgeGraph'));
                var categories = [];
                for (var i = 0; i < 2; i++) {
                    categories[i] = {
                        name: '测试'
                    };
                }
                console.log("entityMapsList1",$scope.entityMapsList);
                console.log("$scope.relationList",$scope.relationList);
                var option = {
                    // 图的标题
                    title: {
                        text: '预测集关系图谱'
                    },
                    // 提示框的配置
                    tooltip: {
                        formatter: function (x) {
                            return x.data.des;
                        }
                    },
                    // 工具箱
                    toolbox: {
                        // 显示工具箱
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            // 还原
                            restore: {
                                show: true
                            },
                            // 保存为图片
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    legend: [{
                        // selectedMode: 'single',
                        data: $scope.categoriesList.map(function (a) {
                            return a.name;
                        })
                    }],
                    series: [{
                        type: 'graph', // 类型:关系图
                        layout: 'force', //图的布局，类型为力导图
                        symbolSize: 40, // 调整节点的大小
                        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [2, 10],
                        edgeLabel: {
                            normal: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        force: {
                            repulsion: 2500,
                            edgeLength: [10, 50]
                        },
                        draggable: true,
                        lineStyle: {
                            normal: {
                                width: 2,
                                color: '#4b565b',
                            }
                        },
                        edgeLabel: {
                            normal: {
                                show: true,
                                formatter: function (x) {
                                    return x.data.name;
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                textStyle: {}
                            }
                        },

                        // 数据
                        data: $scope.entityMapsList,
                        links: $scope.relationList,
                        categories: $scope.categoriesList
                    }]
                };
                myChart.setOption(option,true);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            };
            $scope.getPredictLabelsPie=function () {
                //echarts.init(document.getElementById('3DChart')).dispose();
                var myChart = echarts.init(document.getElementById('predictLabelsPie'));
                myChart.setOption({
                    title : {
                        text: '预测标签概率分布',
                        subtext: '文本分类',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: $scope.sentenceLabel
                    },
                    series : [
                        {
                            name: '标签',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:$scope.pieDataList,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },true);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            };
            $scope.getPredictLabelsWords=function () {
                //echarts.init(document.getElementById('3DChart')).dispose();
                var myChart = echarts.init(document.getElementById('predictLabelsWords'));
                var option = {
                    title: {
                        text: '预测标签云',//标题
                        x: 'center',
                        textStyle: {
                            fontSize: 23
                        }

                    },
                    backgroundColor: '#F7F7F7',
                    tooltip: {
                        show: true
                    },
                    series: [{
                        name: '文本分类预测标签',//数据提示窗标题
                        type: 'wordCloud',
                        sizeRange: [6, 66],//画布范围，如果设置太大会出现少词（溢出屏幕）
                        rotationRange: [-45, 90],//数据翻转范围
                        //shape: 'circle',
                        textPadding: 0,
                        autoSize: {
                            enable: true,
                            minSize: 6
                        },
                        textStyle: {
                            normal: {
                                color: function() {
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160)
                                    ].join(',') + ')';
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: $scope.pieDataList//name和value建议用小写，大写有时会出现兼容问题
                    }]
                };
                myChart.setOption(option,true);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            };
            //$scope.getPredictLabelsPie();
            //$scope.getPredictLabelsWords();

        });
