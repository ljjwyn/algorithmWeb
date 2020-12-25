package com.ouc.algorithm.demo.entity;


import lombok.Data;

import java.util.Date;

@Data
public class PredictDataSet {
    private int id;
    private String taskUid;
    private String dataSetName;
    private String dataSetDescription;
    private String useModelName;
    private Double predictProcess;
    private String outputFileName;
    private Date createTime;
}
