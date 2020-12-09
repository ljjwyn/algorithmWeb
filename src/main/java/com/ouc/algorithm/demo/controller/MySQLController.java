package com.ouc.algorithm.demo.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("MySQLManager/mysql")
public class MySQLController {

    @RequestMapping(value = "/connect", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> connect(@RequestBody String str) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, String> map = JSONObject.parseObject(str, Map.class);
        Connector connector = new Connector();
        String message = connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"),
                map.get("dbName"));
        result.put("message", message);
        connector.disconnect();
        return result;
    }


    @RequestMapping(value = "/test", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> test(@RequestBody String str) throws Exception {
        System.out.println(str);
        String res = "success";
        Map<String, String> result = new HashMap<String, String>();
        result.put("result", res);
        return result;
    }

    @RequestMapping(value = "/tables", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> showTables(@RequestBody String str) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);
        System.out.println("test:" + map);
        if (map == null || map.isEmpty()) {
            return null;
        } else {
            Connector connector = new Connector();
            connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"), map.get("dbName"));
            ArrayList<String> tableName = connector.showTables();
            System.out.println(tableName);
            result.put("data", tableName);
            connector.disconnect();
            return result;
        }
    }

    @RequestMapping(value = "/tables/{tableName}", produces = {
            "application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> showColumnType(@PathVariable String tableName, @RequestBody String str)
            throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);

        if (map == null || map.isEmpty()) {
            return null;
        } else {
            Connector connector = new Connector();
            connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"), map.get("dbName"));
            Map<String, String> columnType = connector.showColumnType(tableName, " * ");
            result.put("data", columnType);
            connector.disconnect();
            return result;
        }
    }


    /**
     * added 2108-10-04 16:29
     *
     * @param tableName
     * @param str
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/tables/{tableName}/comments", produces = {
            "application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getColumnComment(@PathVariable String tableName, @RequestBody String str)
            throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);
        if (map == null || map.isEmpty()) {
            return null;
        } else {
            Connector connector = new Connector();
            connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"), map.get("dbName"));
            Map<String, String> columnType = new HashMap<>();
            if (!tableName.equals("undefined")) {
                columnType = connector.getColumnCommentByTableName(tableName);
            }
            result.put("data", columnType);
            System.out.println("columntype" + columnType);
            connector.disconnect();
            System.out.println("result" + result);
            return result;
        }
    }

    /**
     * added 2108-10-04 16:29
     *
     * @param str
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/tables/comments", produces = {
            "application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getTableComment(@RequestBody String str)
            throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);
        List<String> tableNames = (List) resquestParams.get("tables");
        System.out.println(map);
        System.out.println(tableNames);
        if (map == null || map.isEmpty()) {
            return null;
        } else {
            Map<String, String> tableComments = new HashMap<>();
            Connector connector = new Connector();
            connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"), map.get("dbName"));
            for (int i = 0; i < tableNames.size(); i++) {
                tableComments.put(tableNames.get(i), connector.getCommentByTableName(tableNames.get(i)));
            }
            System.out.println(tableComments);
            result.put("data", tableComments);
            connector.disconnect();
            return result;
        }
    }


    @RequestMapping(value = "/select", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> sqlSelect(@RequestBody String str) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);
        String sql = (String) resquestParams.get("sql");
/*		Integer maxRows = (Integer) resquestParams.get("maxRows");
		if(maxRows == null){
			maxRows = 0;
		}
*/
        if (map == null || map.isEmpty()) {
            return null;
        } else {
            Connector connector = new Connector();
            connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"), map.get("dbName"));
            ArrayList<Map<String, String>> rows = connector.sqlSelect(sql, 5);
            System.out.println(rows);
            result.put("data", rows);
            connector.disconnect();
            return result;
        }
    }

    @RequestMapping(value = "/update", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> sqlUpdate(@RequestBody String str) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);
        if (map == null || map.isEmpty()) {
            return null;
        } else {
            String sql = (String) resquestParams.get("sql");
            Connector connector = new Connector();
            connector.connect(map.get("ip"), map.get("port"), map.get("username"), map.get("password"), map.get("dbName"));
            String message = connector.sqlUpdate(sql);
            result.put("message", message);
            connector.disconnect();
            return result;
        }
    }
	
	/*@RequestMapping(value = "/mysql2hdfs", produces = { "application/json;charset=UTF-8" }, method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> mysql2hdfs(@RequestBody String str) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        Map<String, String> map = getDBConfig(resquestParams);
		if(map == null || map.isEmpty()){
			result.put("message", "Connection error");
			return result;
		}
		else{
			String sql = (String) resquestParams.get("sql");
			String outputDirectory = (String) resquestParams.get("outputDirectory");
			List<String> meta = JSON.parseArray(JSON.parseObject(str).getString("meta"), String.class);
			MySQL2HDFS mySql2hdfs = new MySQL2HDFS();
			Thread sqoopThread = new Thread() {
				public void run() {
					try {
						mySql2hdfs.start(map.get("ip"), map.get("port"), map.get("username"), map.get("password"),
								map.get("dbName"), sql, outputDirectory, meta);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			};
			sqoopThread.start();
			result.put("message", "success");
			return result;
		}
	}


	@RequestMapping(value = "/mysql2hdfs/progress", produces = { "application/json;charset=UTF-8" }, method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> getMysql2hdfsJobProgress(@RequestBody String str) throws Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        String outputDirectory = (String)resquestParams.get("outputDirectory");
        MySQL2HDFS mySql2hdfs = new MySQL2HDFS();
        result.put("progress", mySql2hdfs.getProgress(outputDirectory));
        return result;
	}*/

    private Map<String, String> getDBConfig(Map<String, Object> requestParams) {
        Map<String, String> map = new HashMap<>();
        if (requestParams == null) {
            return null;
        } else {
            String ip = (String) requestParams.get("ip");
            String port = (String) requestParams.get("port");
            String username = (String) requestParams.get("username");
            String password = (String) requestParams.get("password");
            String dbName = (String) requestParams.get("dbName");
            map.put("ip", ip);
            map.put("port", port);
            map.put("username", username);
            map.put("password", password);
            map.put("dbName", dbName);
            return map;
        }
    }

}
