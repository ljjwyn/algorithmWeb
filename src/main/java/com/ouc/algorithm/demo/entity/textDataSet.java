package com.ouc.algorithm.demo.entity;

import java.util.Date;

public class textDataSet {
    private int id;
    private String dataSetName;
    private String dataSetCatalog;
    private String dataSetDescription;
    private String dataSetSubFile;
    private String dataSetPath;
    private Date createTime;

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getId() {
        return id;
    }

    public String getDataSetName() {
        return dataSetName;
    }

    public String getDataSetCatalog() {
        return dataSetCatalog;
    }

    public String getDataSetDescription() {
        return dataSetDescription;
    }

    public String getDataSetSubFile() {
        return dataSetSubFile;
    }

    public String getDataSetPath() {
        return dataSetPath;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDataSetName(String dataSetName) {
        this.dataSetName = dataSetName;
    }

    public void setDataSetCatalog(String dataSetCatalog) {
        this.dataSetCatalog = dataSetCatalog;
    }

    public void setDataSetDescription(String dataSetDescription) {
        this.dataSetDescription = dataSetDescription;
    }

    public void setDataSetPath(String dataSetPath) {
        this.dataSetPath = dataSetPath;
    }

    public void setDataSetSubFile(String dataSetSubFile) {
        this.dataSetSubFile = dataSetSubFile;
    }
}
