package com.ouc.algorithm.demo.controller;

import com.ouc.algorithm.demo.entity.TaskManagement;
import com.ouc.algorithm.demo.mapper.TaskManagementMapper;
import com.ouc.algorithm.demo.mapper.modelBuildRecordMapper;
import com.ouc.algorithm.demo.mapper.modelConfigMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/taskManagement")

public class TaskManagementController {

    private static final Logger log = LoggerFactory.getLogger(TaskManagement.class);

    //TaskManagement taskManagement;
    @Autowired
    private TaskManagementMapper taskManagementMapper;

    @Autowired
    private modelBuildRecordMapper modelbuildRecordMapper;

    @Autowired
    private modelConfigMapper modelconfigMapper;

    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> insertSql(@RequestBody Map<String, Object> resquestParams) throws Exception {
        //Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        TaskManagement taskManagement=confParams(resquestParams);
        System.out.println(taskManagement.getUid());
        System.out.println(taskManagement.getTaskName());
        taskManagementMapper.createATask(taskManagement);
        Map<String,String> res = new HashMap<>();
        res.put("taskId",taskManagement.getUid());
        return res;
    }
    @RequestMapping(value = "/getalltask", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public List<TaskManagement> getAllTask(){
        List<TaskManagement> taskManagementList;
        taskManagementList=taskManagementMapper.getAllTasks();
        return taskManagementList;
    }


    @RequestMapping(value = "/delete", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteSql(@RequestBody Map<String, Object> resquestParams) throws Exception {
        String uid=(String)resquestParams.get("uid");
        System.out.println(resquestParams);
        taskManagementMapper.deleteTask(uid);
        Map<String,String> res = new HashMap<>();
        res.put("state","delete success");
        return res;
    }

    @RequestMapping(value = "/deleteallrecord", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteAllRecord(@RequestBody Map<String, String> requestParams){
        Map<String,String> responseMap = new HashMap<>();
        String uuid = requestParams.get("taskUid");
        String modelConfigUid = modelbuildRecordMapper.getAModelConfigId(uuid);
        String modelSaveName = modelbuildRecordMapper.getAModelSaveName(uuid);
        if(modelConfigUid==null){
            taskManagementMapper.deleteTask(uuid);
            responseMap.put("code", "201");
            responseMap.put("message","任务没有建模信息，已将任务信息删除");
            return responseMap;
        }
        File file = new File("/home/jiajie/test/data/models/"+modelSaveName);
        if(file.exists()) {
            modelbuildRecordMapper.deleteModel(uuid);
            modelconfigMapper.deleteModelConfig(modelConfigUid);
            taskManagementMapper.deleteTask(uuid);
            file.delete();
            responseMap.put("code", "200");
            responseMap.put("message","删除完成");
        }else {
            responseMap.put("code", "202");
            responseMap.put("message","未找到模型文件，可能模型在构建中，删除失败");
        }
        return responseMap;
    }


    public TaskManagement confParams(Map<String,Object> par){
        TaskManagement taskManagement=new TaskManagement();
        long startTime = System.nanoTime();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        taskManagement.setUid(uuid);
        Date date=new Date();
        taskManagement.setTaskDescription((String)par.get("taskDesc"));
        taskManagement.setTaskName((String)par.get("taskName"));
        taskManagement.setStartDate(date);
        return taskManagement;
    }



}
