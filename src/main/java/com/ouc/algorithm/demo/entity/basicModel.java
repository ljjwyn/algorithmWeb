package com.ouc.algorithm.demo.entity;

public class basicModel {
    private int id;
    private String modelName;
    private String modelCatalog;
    private String modelDec;
    private String modelDefaultConf;
    private int methodId;

    public int getMethodId() {
        return methodId;
    }

    public void setMethodId(int methodId) {
        this.methodId = methodId;
    }

    public int getId() {
        return id;
    }

    public String getModelName() {
        return modelName;
    }

    public String getModelCatalog() {
        return modelCatalog;
    }

    public String getModelDec() {
        return modelDec;
    }

    public String getModelDefaultConf() {
        return modelDefaultConf;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setModelCatalog(String modelCatalog) {
        this.modelCatalog = modelCatalog;
    }

    public void setModelDec(String modelDec) {
        this.modelDec = modelDec;
    }

    public void setModelDefaultConf(String modelDefaultConf) {
        this.modelDefaultConf = modelDefaultConf;
    }
}
