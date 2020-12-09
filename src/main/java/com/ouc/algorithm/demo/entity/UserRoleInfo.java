package com.ouc.algorithm.demo.entity;

import lombok.Data;

import java.util.List;

@Data
public class UserRoleInfo {
    int id;
    String token;
    String roles;
    String username;
    String imgurl;
}
