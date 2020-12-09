package com.ouc.algorithm.demo;

import com.ouc.algorithm.demo.service.RedisServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    RedisServiceImpl redisService;

    @Test
    void contextLoads() {
        redisService.visitsCountPlusOne();
    }

}
