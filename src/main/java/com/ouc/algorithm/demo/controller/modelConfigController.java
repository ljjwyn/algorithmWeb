package com.ouc.algorithm.demo.controller;
import com.ouc.algorithm.demo.entity.modelConfig;
import com.ouc.algorithm.demo.mapper.modelConfigMapper;
import org.omg.PortableInterceptor.SYSTEM_EXCEPTION;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/modelconfig")

public class modelConfigController {
    private static final Logger log = LoggerFactory.getLogger(modelConfig.class);

    @Autowired
    private modelConfigMapper modelconfigMapper;

    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> insertSql(@RequestBody Map<String, Object> resquestParams) throws Exception {
        modelConfig modelconfig=confParams(resquestParams);
        System.out.println(modelconfig);
        modelconfigMapper.createATask(modelconfig);
        Map<String,String> res = new HashMap<>();
        res.put("confUid",modelconfig.getUid());
        return res;
    }

    @RequestMapping(value = "/getallconfig", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public List<modelConfig> getAllTask(){
        List<modelConfig> modelConfigList;
        modelConfigList=modelconfigMapper.getAllModelConfig();
        System.out.println(modelConfigList);
        return modelConfigList;
    }

    @RequestMapping(value = "/getaconfig", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public modelConfig getAConfig(@RequestBody Map<String,String> resquestParams) throws Exception{
        modelConfig modelconfig=modelconfigMapper.getATask(resquestParams.get("configId"));
        return modelconfig;
    }

    @RequestMapping(value = "/updatedatasetname", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateDataSetName(@RequestBody Map<String, Object> resquestParams) throws Exception {
        System.out.println(resquestParams.get("modelConfMap"));
        modelconfigMapper.updateDataSetName((String)resquestParams.get("dataSetName"),(String)resquestParams.get("modelConfMap"),(String)resquestParams.get("confId"));
        Map<String,String> res = new HashMap<>();
        res.put("state","finished");
        return res;
    }


    public modelConfig confParams(Map<String,Object> par){
        modelConfig modelconfig=new modelConfig();
        System.out.println(par);
        String uid = UUID.randomUUID().toString().replaceAll("-", "");
        modelconfig.setUid(uid);
        modelconfig.setModelName((String)par.get("modelName"));
        modelconfig.setDataSetName((String)par.get("dataSetName"));
        modelconfig.setConfigDescription((String)par.get("configDescription"));
        modelconfig.setModelConfMap((String)par.get("modelConfMap"));
        modelconfig.setModelType((String)par.get("modelType"));
        modelconfig.setBasicModelId(Integer.parseInt(par.get("basicModelId").toString()));
        return modelconfig;
    }
}
