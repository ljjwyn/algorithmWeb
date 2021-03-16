package com.ouc.algorithm.demo.controller;

import com.alibaba.fastjson.JSONObject;
import com.ouc.algorithm.demo.entity.PredictDataSet;
import com.ouc.algorithm.demo.entity.TaskManagement;
import com.ouc.algorithm.demo.mapper.PredictDataSetMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/predictDatSet")
public class PredictDataSetController {
    private static final Logger log = LoggerFactory.getLogger(PredictDataSetController.class);

    @Autowired
    PredictDataSetMapper predictDataSetMapper;

    /**
     * 新建任务为测试任务时，调用接口存上传的预测数据集的相关属性信息。
     *
     * @param requestPredictDataSet
     * @return
     */
    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public String insertAPredictDataSet(@RequestBody PredictDataSet requestPredictDataSet) {
        JSONObject responseJson = new JSONObject();
        Date nowTime = new Date();
        requestPredictDataSet.setCreateTime(nowTime);
        int predictDataSetId = predictDataSetMapper.createAPredictDataSet(requestPredictDataSet);
        responseJson.put("predictDataSetId", predictDataSetId);
        responseJson.put("code", 200);
        responseJson.put("message", "预测数据集已存入数据库");
        return responseJson.toJSONString();
    }


}
