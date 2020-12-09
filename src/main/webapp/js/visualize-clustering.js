$("#visualize").on("click",function(){
	
	var taskId = $("#taskId").val();
	
	var chart = echarts.init(document.getElementById('main'));
	

	var schema = [
	    {name: 'cluster', index: 0},
	    {name: 'yuanyin', index: 1},
	    {name: 'ranliao', index: 2},
	    {name: 'ren', index: 3},
	    {name: 'zhufang', index: 4},
	    {name: 'juli', index: 5},
	    {name: 'shouru', index: 6}
	];

	var config = {
	    xAxis3D: 'yuanyin',
	    yAxis3D: 'ranliao',
	    zAxis3D: 'ren',
	    color: 'cluster',
	    symbolSize: 'zhufang'
	};

	var fieldIndices = schema.reduce(function (obj, item) {
	    obj[item.name] = item.index;
	    return obj;
	}, {});

	var groupCategories = [];
	var groupColors = [];
	var data;
	var fieldNames = schema.map(function (item) {
	    return item.name;
	});
	fieldNames = fieldNames.slice(1, fieldNames.length);

	function getMaxOnExtent(data) {
	    var symbolSizeMax = -Infinity;
	    for (var i = 0; i < data.length; i++) {
	        var item = data[i];
	        var symbolSizeVal = item[fieldIndices[config.symbolSize]];
	        symbolSizeMax = Math.max(symbolSizeVal, symbolSizeMax);
	    }
	    return {
	        symbolSize: symbolSizeMax
	    };
	}

	$.getJSON('http://cluster.uspacex.com/WebProj/clustering/tasks/' + taskId + '/visualization', function (result) {
		data = JSON.parse(result.dataPoints);
		var categories = JSON.parse(result.categories);
	    var max = getMaxOnExtent(data);
	    chart.setOption({
			toolbox: {
				show: true,
				left: 'left',
				feature: {
					dataView: {readOnly: true},
					restore: {},
					saveAsImage: {}
				}
			},
	        tooltip: {
				formatter: function(params){
					var result = "";
					//params.data[5]为当前数据在data中的索引
					var dataIndex = params.data[5];
					for(var i = 0; i<schema.length; i++){
						result += schema[i].name + ": "+ data[dataIndex][i] + "<br>";
					}
					return result;
				}
			},
	        visualMap: [{
	            dimension: config.color,
				categories: categories,
	            inRange: {
	            	color: ['#1710c0', '#0b9df0', "#9F2E61",'#00fea8',"#2F9323","#D9B63A","#2E2AA4","#4D670C","#BF675F",
	            		"#1F814A","#357F88","#673509","#310937","#1B9637","#F7393C"]
	            },
	            textStyle: {
	            }
	        }, {
	            bottom: 10,
	            calculable: true,
	            dimension: 4,
				show: false,
	            max: max.symbolSize / 2,
	            inRange: {
	                symbolSize: [5, 15]
	            },
	            textStyle: {
	            }
	        }],
	        xAxis3D: {
	            name: config.xAxis3D,
	            type: 'value'
	        },
	        yAxis3D: {
	            name: config.yAxis3D,
	            type: 'value'
	        },
	        zAxis3D: {
	            name: config.zAxis3D,
	            type: 'value'
	        },
	        grid3D: {
	            axisLine: {
	                lineStyle: {
	                }
	            },
	            axisPointer: {
	                lineStyle: {
	                    color: '#ffbd67'
	                }
	            },
	            viewControl: {
	                // autoRotate: true
	                // projection: 'orthographic'
	            }
	        },
	        series: [{
	            type: 'scatter3D',
	            dimensions: [
	                config.xAxis3D,
	                config.yAxis3D,
	                config.zAxis3D,
	                config.color,
	                config.symbolSize
	            ],
	            data: data.map(function (item, idx) {
	                return [
	                    item[fieldIndices[config.xAxis3D]],
	                    item[fieldIndices[config.yAxis3D]],
	                    item[fieldIndices[config.zAxis3D]],
	                    item[fieldIndices[config.color]],
	                    item[fieldIndices[config.symbolSize]],
	                    idx
	                ];
	            }),
	            symbolSize: 12,
	            // symbol: 'triangle',
	            itemStyle: {
	                borderWidth: 1,
	                borderColor: 'rgba(255,255,255,0.8)'
	            },
	            emphasis: {
	                itemStyle: {
	                }
	            }
	        }]
	    });

	    var gui = new dat.GUI();

	    ['xAxis3D', 'yAxis3D', 'zAxis3D', 'symbolSize'].forEach(function (fieldName) {
	        gui.add(config, fieldName, fieldNames).onChange(function () {
	            var max = getMaxOnExtent(data);
	            if (data) {
	                chart.setOption({
	                    visualMap: [{
						}, {
	                        max: max.symbolSize / 2
	                    }],
	                    xAxis3D: {
	                        name: config.xAxis3D
	                    },
	                    yAxis3D: {
	                        name: config.yAxis3D
	                    },
	                    zAxis3D: {
	                        name: config.zAxis3D
	                    },
	                    series: {
	                        dimensions: [
	                            config.xAxis3D,
	                            config.yAxis3D,
	                            config.zAxis3D,
	                            config.color,
	                            config.symbolSize
	                        ],
	                        data: data.map(function (item, idx) {
	                            return [
	                                item[fieldIndices[config.xAxis3D]],
	                                item[fieldIndices[config.yAxis3D]],
	                                item[fieldIndices[config.zAxis3D]],
	                                item[fieldIndices[config.color]],
	                                item[fieldIndices[config.symbolSize]],
	                                idx
	                            ];
	                        })
	                    }
	                });
	            }
	        });
	    });
	});
	window.addEventListener('resize', function () {
	    chart.resize();
	});	
	
	
	
	
	
	
	
	
	
	
});


