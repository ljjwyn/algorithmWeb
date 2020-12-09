package com.ouc.algorithm.demo.controller;

import com.ouc.algorithm.demo.entity.textDataSet;
import com.ouc.algorithm.demo.mapper.textDataSetMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/textDataSet")
public class textDataSetController {

    private static final Logger log = LoggerFactory.getLogger(textDataSet.class);
    @Autowired
    private textDataSetMapper textdatasetmapper;

    @RequestMapping(value = "/getdatasettype", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public List<String> getDataSetType(@RequestBody Map<String, String> resquestParams){
        List<String> dataSetCatalogList;
        dataSetCatalogList=textdatasetmapper.getDataSetType(resquestParams.get("dataSetType"));
        return dataSetCatalogList;
    }

    @RequestMapping(value = "/getalldataset", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public List<textDataSet> getAllTask(){
        List<textDataSet> textDataSetList;
        textDataSetList=textdatasetmapper.getAllDataSets();
        return textDataSetList;
    }

    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> insertSql(@RequestBody Map<String, Object> resquestParams) throws Exception {
        textDataSet textdataSet=confParams(resquestParams);
        System.out.println(textdataSet);
        textdatasetmapper.createATask(textdataSet);
        Map<String,String> res = new HashMap<>();
        res.put("countInfo","数据集"+textdataSet.getDataSetName()+"上传成功!");
        return res;
    }

    @RequestMapping(value = "/delete", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteSql(@RequestBody Map<String, Integer> resquestParams) throws Exception {
        textdatasetmapper.deleteDataSet(resquestParams.get("id"));
        Map<String,String> res = new HashMap<>();
        res.put("state","delete success");
        return res;
    }

    public textDataSet confParams(Map<String,Object> par) {
        textDataSet textdataSet = new textDataSet();
        Date date=new Date();
        textdataSet.setDataSetName((String)par.get("dataSetName"));
        textdataSet.setDataSetCatalog((String) par.get("dataSetCatalog"));
        textdataSet.setDataSetDescription((String) par.get("dataSetDescription"));
        textdataSet.setCreateTime(date);
        textdataSet.setDataSetPath("/home/jiajie/test/data/"+par.get("dataSetName"));
        return textdataSet;
    }
}

