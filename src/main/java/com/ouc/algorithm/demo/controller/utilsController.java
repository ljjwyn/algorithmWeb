package com.ouc.algorithm.demo.controller;

import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据集管理的接口，目前主要是数据上传的处理接口
 */
@RestController
@MultipartConfig
public class utilsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(utilsController.class);

    @GetMapping("/multiUpload")
    public String multiUpload() {
        return "multiUpload";
    }

    @PostMapping("/multiUpload")
    @ResponseBody
    public String multiUpload(HttpServletRequest request, @RequestParam("datasetname") String dataSetName) {
        System.out.println("数据集名称:" + dataSetName);
        String filePath = "";
        if (dataSetName.isEmpty()) {
            return "错误！数据集名称为空";
        } else {
            filePath = "/home/jiajie/test/data/" + dataSetName + "/";
            File file = new File(filePath);
            if (!file.exists()) {//如果文件夹不存在
                file.mkdir();//创建文件夹
            } else {
                return "错误！数据集存在";
            }
        }
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles("files");

        for (int i = 0; i < files.size(); i++) {
            String FileName = "";
            if (i == 0) {
                FileName = "Train";
            } else if (i == 1) {
                FileName = "Class";
            } else if (i == 2) {
                FileName = "Test";
            } else if (i == 3) {
                FileName = "Dev";
            }
            MultipartFile file = files.get(i);
            if (file.isEmpty()) {
                return "共有" + (i++) + "个文件上传";
            }
            File dest = new File(filePath + FileName);
            try {
                file.transferTo(dest);
                LOGGER.info("第" + (i + 1) + "个文件上传成功");
            } catch (IOException e) {
                LOGGER.error(e.toString(), e);
                return "上传第" + (i++) + "个文件失败";
            }
        }
        return "上传成功";
    }

    @GetMapping("/uploadtest")
    public String uploadtest() {
        return "testFile";
    }

    @PostMapping("/uploadtest")
    @ResponseBody
    public String uploadtest(@RequestParam("file") MultipartFile file, HttpServletRequest request, @RequestParam("datasetname") String dataSetName) throws IOException {
        String path = "/home/jiajie/test/data/" + dataSetName + "/";
        File fileName = new File(path);
        if (!fileName.exists()) {
            return "错误！数据集不存在";
        }
        String FileName = "Predict";
        File dest = new File(path + FileName);
        try {
            file.transferTo(dest);
            LOGGER.info("文件上传成功");
        } catch (IOException e) {
            LOGGER.error(e.toString(), e);
            return "上传文件失败";
        }
        return "完成上传";
    }

    @GetMapping("/uploadpredict")
    public String uploadPredict() {
        return "请用post上传文件";
    }

    @PostMapping("/uploadpredict")
    @ResponseBody
    public String uploadPredict(HttpServletRequest request,
                                @RequestParam("datasetname") String dataSetName) throws IOException {
        JSONObject responseJson = new JSONObject();
        //TODO mac与服务器上注意转化上传文件路
        //String path = "/home/jiajie/test/data/predictDataSet/"+dataSetName;
        String path = "/Users/ljjwyn/dataSet/" + dataSetName;
        if (dataSetName.isEmpty()) {
            responseJson.put("code", 401);
            responseJson.put("message", "数据集名称为空");
            return responseJson.toJSONString();
        }
        File fileName = new File(path);
        if (fileName.exists()) {
            responseJson.put("code", 402);
            responseJson.put("message", "数据集存在");
            return responseJson.toJSONString();
        }
        File dest = new File(path);
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles("files");
        try {
            // 这里将文件上传个数限定在1个，所以取的index=0
            files.get(0).transferTo(dest);
            responseJson.put("code", 200);
            responseJson.put("message", "文件上传成功");
            LOGGER.info("文件上传成功");
        } catch (IOException e) {
            LOGGER.error(e.toString(), e);
            responseJson.put("code", 500);
            responseJson.put("message", "文件上传失败");
            return responseJson.toJSONString();
        }
        return responseJson.toJSONString();
    }
}
