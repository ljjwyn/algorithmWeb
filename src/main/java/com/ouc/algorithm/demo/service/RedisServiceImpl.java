package com.ouc.algorithm.demo.service;

import com.ouc.algorithm.demo.utils.JedisUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.util.concurrent.locks.ReentrantLock;

@Service
public class RedisServiceImpl implements RedisService {

    private static final Logger log = LoggerFactory.getLogger(RedisServiceImpl.class);

    final ReentrantLock lock = new ReentrantLock();

    final String VISITS_COUNT_KEY = "visits_count";

    @Autowired
    JedisUtil jedisUtil;

    @Override
    public String totalVisitsCount() {
        return jedisUtil.get(VISITS_COUNT_KEY);
    }

    @Override
    public String todayVisitCount() {
        return null;
    }

    @Override
    public void visitsCountPlusOne() {

        //并发访问加1，用可重入锁确保访问量值写入的并发安全。
        lock.lock();
        try {
            String nowVisitCount = jedisUtil.get(VISITS_COUNT_KEY);
            //TODO redis流的意外中断未解决，有空研究一下
            while (nowVisitCount==null){
                nowVisitCount = jedisUtil.get(VISITS_COUNT_KEY);
            }

            String newVisitCount = String.valueOf(Integer.parseInt(nowVisitCount)+1);
            jedisUtil.set(VISITS_COUNT_KEY,newVisitCount);
            log.info("Thread:{}, VisitCount:{} -> {}",Thread.currentThread().getId(),nowVisitCount,newVisitCount);
        }catch (Exception J){
            log.info("redis 异常关闭:{}",J.getMessage());
        }
        finally {
            //释放锁
            lock.unlock();
        }
    }
}
