package com.ouc.algorithm.demo.controller;

import com.ouc.algorithm.demo.service.RedisServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    RedisServiceImpl redisService;

    @RequestMapping(value = "/visitorcount", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getVisitorCount() {
        Map<String, Object> responseMap = new HashMap<>();
//        redisService.visitsCountPlusOne();
//        String visitorCount = redisService.totalVisitsCount();
        String visitorCount = "1234";
        if (visitorCount == null) {
            responseMap.put("code", 500);
            responseMap.put("message", "获取访问量错误");
        } else {
            responseMap.put("code", 200);
            responseMap.put("visitorCount", visitorCount);
        }
        return responseMap;
    }


}
