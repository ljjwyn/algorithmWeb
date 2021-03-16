package com.ouc.algorithm.demo.controller;

import com.ouc.algorithm.demo.entity.textDataSet;
import com.ouc.algorithm.demo.mapper.textDataSetMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/textDataSet")
public class textDataSetController {

    private static final Logger log = LoggerFactory.getLogger(textDataSet.class);
    @Autowired
    private textDataSetMapper textdatasetmapper;

    @RequestMapping(value = "/getdatasettype", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public List<String> getDataSetType(@RequestBody Map<String, String> resquestParams) {
        List<String> dataSetCatalogList;
        dataSetCatalogList = textdatasetmapper.getDataSetType(resquestParams.get("dataSetType"));
        return dataSetCatalogList;
    }

    @RequestMapping(value = "/getalldataset", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public List<textDataSet> getAllTask() {
        List<textDataSet> textDataSetList;
        textDataSetList = textdatasetmapper.getAllDataSets();
        return textDataSetList;
    }

    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> insertSql(@RequestBody Map<String, Object> resquestParams) throws Exception {
        textDataSet textdataSet = confParams(resquestParams);
        System.out.println(textdataSet);
        textdatasetmapper.createATask(textdataSet);
        Map<String, String> res = new HashMap<>();
        res.put("countInfo", "数据集" + textdataSet.getDataSetName() + "上传成功!");
        return res;
    }

    @RequestMapping(value = "/delete", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> deleteSql(@RequestBody Map<String, Integer> resquestParams) throws Exception {
        textdatasetmapper.deleteDataSet(resquestParams.get("id"));
        Map<String, String> res = new HashMap<>();
        res.put("state", "delete success");
        return res;
    }

    @RequestMapping(value = "/deleteall", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> deleteAll(@RequestBody Map<String, Integer> resquestParams) throws Exception {
        Map<String, String> responseMap = new HashMap<>();
        int dataSetId = resquestParams.get("id");
        String dataSetName = textdatasetmapper.getADataSetName(dataSetId);
        int deleteRow = textdatasetmapper.deleteDataSet(dataSetId);
        if (deleteRow >= 0) {
            String filePath = "/home/jiajie/test/data/" + dataSetName;
            try {
                deleteDir(filePath);
                responseMap.put("code", "200");
                responseMap.put("message", "删除成功");
            } catch (Exception e) {
                log.error("文件删除异常，严重的错误！");
                responseMap.put("code", "500");
                responseMap.put("message", "删除失败，文件夹删除失败！");
            }
        }
        return responseMap;
    }

    public textDataSet confParams(Map<String, Object> par) {
        textDataSet textdataSet = new textDataSet();
        Date date = new Date();
        textdataSet.setDataSetName((String) par.get("dataSetName"));
        textdataSet.setDataSetCatalog((String) par.get("dataSetCatalog"));
        textdataSet.setDataSetDescription((String) par.get("dataSetDescription"));
        textdataSet.setCreateTime(date);
        textdataSet.setDataSetPath("/home/jiajie/test/data/" + par.get("dataSetName"));
        return textdataSet;
    }


    /**
     * 迭代删除文件夹
     *
     * @param dirPath 文件夹路径
     */
    public static void deleteDir(String dirPath) {
        File file = new File(dirPath);
        if (file.isFile()) {
            file.delete();
        } else {
            File[] files = file.listFiles();
            if (files == null) {
                file.delete();
            } else {
                for (int i = 0; i < files.length; i++) {
                    deleteDir(files[i].getAbsolutePath());
                }
                file.delete();
            }
        }
    }


}

