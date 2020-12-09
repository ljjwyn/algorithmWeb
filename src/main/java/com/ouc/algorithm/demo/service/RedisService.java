package com.ouc.algorithm.demo.service;

public interface RedisService {
    String totalVisitsCount();

    String todayVisitCount();

    void visitsCountPlusOne();
}
