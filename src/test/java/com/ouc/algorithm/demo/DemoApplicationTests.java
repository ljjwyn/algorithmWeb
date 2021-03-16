package com.ouc.algorithm.demo;

import com.ouc.algorithm.demo.entity.PredictDataSet;
import com.ouc.algorithm.demo.mapper.PredictDataSetMapper;
import com.ouc.algorithm.demo.service.MedicalGraphSearch;
import com.ouc.algorithm.demo.service.RedisServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    RedisServiceImpl redisService;

    @Autowired
    MedicalGraphSearch medicalGraphSearch;

    @Autowired
    PredictDataSetMapper predictDataSetMapper;

    @Test
    void contextLoads() {
        redisService.visitsCountPlusOne();
    }

    @Test
    void testGraphAPI() {
        HashMap a = medicalGraphSearch.loadCMeKGDB("胰腺癌");
        System.out.println(1);
    }

    @Test
    void testPredictDataSet() {
        Date nowTime = new Date();
        PredictDataSet predictDataSet = new PredictDataSet();
        predictDataSet.setTaskUid("ceshi");
        predictDataSet.setDataSetName("ceshidataSetName");
        predictDataSet.setDataSetDescription("ceshicehi");
        predictDataSet.setUseModelName("modelName");
        predictDataSet.setCreateTime(nowTime);
        int res = predictDataSetMapper.createAPredictDataSet(predictDataSet);
        System.out.println(res);
    }

    @Test
    void testSelectPredictDataSet() {
        List<PredictDataSet> predictDataSetList = predictDataSetMapper.getAllPredictDataSet();
        System.out.println(1);
    }


}
