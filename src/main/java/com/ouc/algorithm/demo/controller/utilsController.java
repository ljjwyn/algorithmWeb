package com.ouc.algorithm.demo.controller;
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
        System.out.println("数据集名称:"+dataSetName);
        String filePath = "";
        if(dataSetName.isEmpty()){
            return "错误！数据集名称为空";
        }else {
            filePath = "/home/jiajie/test/data/"+dataSetName+"/";
            File file=new File(filePath);
            if(!file.exists()){//如果文件夹不存在
                file.mkdir();//创建文件夹
            }else {
                return "错误！数据集存在";
            }
        }
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles("files");

        for (int i = 0; i < files.size(); i++) {
            String FileName="";
            if(i==0){
                FileName="Train";
            }else if(i==1){
                FileName="Class";
            }else if(i==2){
                FileName="Test";
            }else if(i==3){
                FileName="Dev";
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
        String path = "/home/jiajie/test/data/"+dataSetName+"/";
        File fileName=new File(path);
        if(!fileName.exists()){
            return "错误！数据集不存在";
        }
        String FileName="Predict";
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
}
