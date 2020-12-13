package com.ouc.algorithm.demo.controller;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ouc.algorithm.demo.entity.ModelBuildRecord;
import com.ouc.algorithm.demo.entity.modelConfig;
import com.ouc.algorithm.demo.mapper.modelBuildRecordMapper;
import com.ouc.algorithm.demo.mapper.modelConfigMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@RestController
@RequestMapping("/modelbuildrecord")
public class modelBuildRecordController {
    private static final Logger log = LoggerFactory.getLogger(ModelBuildRecord.class);

    //TaskManagement taskManagement;
    @Autowired
    private modelBuildRecordMapper modelbuildRecordMapper;

    @Autowired
    private modelConfigMapper modelconfigMapper;

    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> insertSql(@RequestBody Map<String, Object> requestParams) throws Exception {
        //Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        ModelBuildRecord modelbuildRecord=confParams(requestParams);
        System.out.println(modelbuildRecord);
        modelbuildRecordMapper.createATask(modelbuildRecord);
        Map<String,String> res = new HashMap<>();
        res.put("taskId",modelbuildRecord.getModelUid());
        res.put("saveModelName",modelbuildRecord.getSaveModelName());
        return res;
    }

    @RequestMapping(value = "/premodeltest", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> getAModelRecord(@RequestBody Map<String,String> requestParams){
        Map<String,Object> responseMap = new HashMap<>();
        String modelUid = requestParams.get("modelUid");

        if (modelUid==null){
            responseMap.put("code",500);
            responseMap.put("message","入参modelUid为空");
            return responseMap;
        }
        ModelBuildRecord modelBuildRecord = modelbuildRecordMapper.getAModelRecord(modelUid);
        if(modelBuildRecord==null){
            responseMap.put("code",501);
            responseMap.put("message","错误的modelUid，查询为空");
            return responseMap;
        }
        modelConfig modelconfig = modelconfigMapper.getATask(modelBuildRecord.getModelConfId());
        JSONObject configMap = JSON.parseObject(modelconfig.getModelConfMap());
        responseMap.put("uid",modelUid);
        responseMap.put("dataSetName",modelconfig.getDataSetName());
        responseMap.put("modelName",modelBuildRecord.getSaveModelName());
        responseMap.put("configMap",configMap);
        responseMap.put("algorithm",modelBuildRecord.getBasicModelId());
        return responseMap;
    }

    @RequestMapping(value = "/getallmodelrecord", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public List<ModelBuildRecord> getAllTask(){
        List<ModelBuildRecord> modelbuildRecord;
        modelbuildRecord=modelbuildRecordMapper.getAllModelRecord();
        return modelbuildRecord;
    }

    @RequestMapping(value = "/updateendtime", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateEndTime(@RequestBody Map<String, String> resquestParams) throws Exception {
        Date date=new Date();
        modelbuildRecordMapper.updateEndTime(date,resquestParams.get("modelUid"));
        Map<String,String> res = new HashMap<>();
        res.put("state","finished");
        return res;
    }

    @RequestMapping(value = "/updateprocess", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateProcess(@RequestBody Map<String, Object> resquestParams) throws Exception {
        System.out.println("建模进程"+resquestParams.get("process"));
        modelbuildRecordMapper.updateProcess(Float.parseFloat((String)resquestParams.get("process")),(String)resquestParams.get("modelUid"));
        Map<String,String> res = new HashMap<>();
        res.put("state","finished");
        return res;
    }

    @RequestMapping(value = "/delete", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteSql(@RequestBody Map<String, String> resquestParams) throws Exception {
        String uid=resquestParams.get("modelUid");
        System.out.println(resquestParams);
        modelbuildRecordMapper.deleteModel(uid);
        Map<String,String> res = new HashMap<>();
        res.put("state","delete success");
        return res;
    }




    /**
     * vue前端的相关新接口
     * @return
     */
    @RequestMapping(value = "/getallmodelrecordvue", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getAllTaskVUE(){
        Map<String,Object> res = new HashMap<>();
        List<ModelBuildRecord> modelbuildRecord;
        modelbuildRecord=modelbuildRecordMapper.getAllModelRecord();
        res.put("code",20000);
        res.put("data",modelbuildRecord);
        return res;
    }

    public ModelBuildRecord confParams(Map<String,Object> par){
        ModelBuildRecord modelbuildRecord=new ModelBuildRecord();
        //String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String uuid=(String)par.get("modelUid");
        modelbuildRecord.setModelUid((String)par.get("modelUid"));
        Date date=new Date();
        modelbuildRecord.setModelName((String)par.get("modelName"));
        modelbuildRecord.setModelDescription((String)par.get("modelDescription"));
        modelbuildRecord.setBasicModelId((String)par.get("basicModelId"));
        modelbuildRecord.setModelConfId((String)par.get("modelConfId"));
        modelbuildRecord.setSaveModelName(uuid.substring(0, 4)+par.get("modelName")+".ckpt");
        modelbuildRecord.setStartTime(date);
        return modelbuildRecord;
    }
}
