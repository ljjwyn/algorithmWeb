package com.ouc.algorithm.demo.controller;

import com.ouc.algorithm.demo.entity.TaskManagement;
import com.ouc.algorithm.demo.mapper.TaskManagementMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/taskManagement")

public class TaskManagementController {

    private static final Logger log = LoggerFactory.getLogger(TaskManagement.class);

    //TaskManagement taskManagement;
    @Autowired
    private TaskManagementMapper taskManagementMapper;

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
