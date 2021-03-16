package com.ouc.algorithm.demo.entity;

import java.util.Date;

public class ModelBuildRecord {
    private int id;
    private String modelUid;
    private String modelName;
    private String modelDescription;
    private String basicModelId;
    private String modelConfId;
    private Float buildingProcess;
    private int modelTestAccuracy;
    private Date startTime;
    private Date endTime;
    private String saveModelName;

    public int getModelTestAccuracy() {
        return modelTestAccuracy;
    }

    public void setModelTestAccuracy(int modelTestAccuracy) {
        this.modelTestAccuracy = modelTestAccuracy;
    }

    public String getSaveModelName() {
        return saveModelName;
    }

    public void setSaveModelName(String saveModelName) {
        this.saveModelName = saveModelName;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getModelName() {
        return modelName;
    }

    public int getId() {
        return id;
    }

    public Date getEndTime() {
        return endTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public String getBasicModelId() {
        return basicModelId;
    }

    public Float getBuildingProcess() {
        return buildingProcess;
    }

    public String getModelDescription() {
        return modelDescription;
    }

    public String getModelConfId() {
        return modelConfId;
    }

    public String getModelUid() {
        return modelUid;
    }

    public void setBasicModelId(String basicModelId) {
        this.basicModelId = basicModelId;
    }

    public void setBuildingProcess(Float buildingProcess) {
        this.buildingProcess = buildingProcess;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public void setModelDescription(String modeDescription) {
        this.modelDescription = modeDescription;
    }

    public void setModelConfId(String modelConfId) {
        this.modelConfId = modelConfId;
    }

    public void setModelUid(String modelUid) {
        this.modelUid = modelUid;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
}
