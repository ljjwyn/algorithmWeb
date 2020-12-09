package com.ouc.algorithm.demo.controller;

import com.alibaba.fastjson.JSONObject;
import com.ouc.algorithm.demo.mapper.MySQLToolsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("MySQLManager/mysql/v2")
public class MySQLControllerV2 {
    @Autowired
    MySQLToolsMapper mySQLToolsMapper;


    @RequestMapping(value = "/tables", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> showTablesAndComments(@RequestBody String str) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> requestParams = JSONObject.parseObject(str, Map.class);
        String dbName = (String) requestParams.get("dbName");
        if (dbName == null || dbName.equals("")) {
            return null;
        } else {
            result.put("data", mySQLToolsMapper.showTables(dbName));
            return result;
        }
    }


    @RequestMapping(value = "/column-info", produces = {
            "application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getColumnNameCommentAndType(@RequestBody String str)
            throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        map.put("data", mySQLToolsMapper.getColumnNameCommentAndType((String) resquestParams.get("tableName"),
                (String) resquestParams.get("dbName")));
        return map;
    }

    @RequestMapping(value = "/dataset/dbs", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    Map<String, Object> getAllSubjectDBs() {
        Map<String, Object> map = new HashMap<>();
        map.put("subjectDBs", mySQLToolsMapper.getAllSubjectDBs());
        return map;
    }


}
