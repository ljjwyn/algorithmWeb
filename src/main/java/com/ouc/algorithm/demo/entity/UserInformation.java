package com.ouc.algorithm.demo.entity;

import lombok.Data;

@Data
public class UserInformation {
    private int id;
    private String userAccount;
    private String userPassword;
    private String userToken;
    private String userDescribe;
    private String userImg;
    private String userType;
}
