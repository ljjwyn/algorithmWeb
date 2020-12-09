package com.ouc.algorithm.demo.entity;

import java.util.Date;

public class TaskManagement {
    private String Uid;
    private String taskDescription;
    private String dataSetTableName;
    private String taskName;
    private Date startDate;
    private Date endDate;
    private String databaseName;

    public String getDatabaseName(){
        return databaseName;
    }

    public String getTaskName(){
        return taskName;
    }

    public Date getEndDate() {
        return endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public String getDataSetTableName() {
        return dataSetTableName;
    }

    public String getTaskDescription() {
        return this.taskDescription;
    }

    public String getUid() {
        return Uid;
    }

    public void setDataSetTableName(String dataSetTableName) {
        this.dataSetTableName = dataSetTableName;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public void setUid(String uid) {
        Uid = uid;
    }

    public void setTaskName(String taskName){this.taskName = taskName;}

    public void setDatabaseName(String databaseName){this.databaseName=databaseName;}
}
