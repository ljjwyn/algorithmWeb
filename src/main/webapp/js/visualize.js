var myChart = echarts.init(document.getElementById('main'));
	
$("#button").on("click",function(){
	$.getJSON("clustering/tasks/" + $("#taskId").val() + "/visualization", function(data) {	
		myChart.setOption({
		    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
		        offset: 0,
		        color: '#f7f8fa'
		    }, {
		        offset: 1,
		        color: '#cdd0d5'
		    }]),

		    tooltip: {
		    	formatter:function(a){ 
		    		var str = a['value'].split(",");
		    		if(str.length < 6){
						return null;
		    		}
		    		var result = ('字段1:'+str[0]  
                    +'</br>字段2:'+str[1]   
                    +'<br>未命名3:'+str[2]   
                    +'<br>字段4:'+str[3]   
                    +'<br>字段5:'+str[4]   
                    +'<br>字段6:'+str[5] );
                    return result;  
                   }  
		    },
		    toolbox: {
		        show: true,
		        feature: {
		            dataView: {
		                show: true,
		                readOnly: true
		            },
		            restore: {
		                show: true
		            },
		            saveAsImage: {
		                show: true
		            }
		        }
		    },
		    animationDuration: 200,
		    animationEasingUpdate: 'quinticInOut',
		    series: [{
		        type: 'graph',
		        layout: 'force',
		        force: {
		        	edgeLength: 50,
		        	repulsion: 50,
		            gravity: 0.1
		        },
		        data: JSON.parse(data.data),
		        links: JSON.parse(data.links),
		        categories: JSON.parse(data.categories),
		        focusNodeAdjacency: true,
		        roam: true,
		        label: {
/*		            normal: {
		                show: true,
		                position: 'top',
		                formatter: '{b}'
		            }
*/		        },
		        lineStyle: {
		            normal: {
		                curveness: 0,
		            }
		        }
		    }]
		});
	});

});
	