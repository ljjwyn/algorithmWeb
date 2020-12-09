package com.ouc.algorithm.demo.entity;

public class modelConfig {
    private int id;
    private String uid;
    private String modelName;
    private String dataSetName;
    private String configDescription;
    private String modelConfMap;
    private String modelType;
    private int basicModelId;

    public void setBasicModelId(int basicModelId) {
        this.basicModelId = basicModelId;
    }

    public int getBasicModelId() {
        return basicModelId;
    }

    public String getModelType() {
        return modelType;
    }

    public void setModelType(String modelType) {
        this.modelType = modelType;
    }

    public void setModelConfMap(String modelConfMap) {
        this.modelConfMap = modelConfMap;
    }

    public String getModelConfMap() {
        return modelConfMap;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDataSetName(String dataSetName) {
        this.dataSetName = dataSetName;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public void setConfigDescription(String configDescription) {
        this.configDescription = configDescription;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public int getId() {
        return id;
    }

    public String getUid() {
        return uid;
    }

    public String getModelName() {
        return modelName;
    }

    public String getDataSetName() {
        return dataSetName;
    }

    public String getConfigDescription() {
        return configDescription;
    }
}
