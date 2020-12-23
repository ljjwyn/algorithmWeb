package com.ouc.algorithm.demo.controller;


import com.alibaba.fastjson.JSONObject;
import com.ouc.algorithm.demo.service.MedicalGraphSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/CMeKG")
public class CMeKGGraphController {
    @Autowired
    MedicalGraphSearch medicalGraphSearch;

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    @ResponseBody
    public HashMap searchGraphData(@RequestBody Map<String,String> requestParam){
        String keyWords = requestParam.get("keyWords");
        return medicalGraphSearch.loadCMeKGDB(keyWords);
    }
}
