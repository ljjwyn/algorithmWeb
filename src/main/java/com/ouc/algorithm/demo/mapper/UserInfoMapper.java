package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.UserInformation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;


@Mapper
@Component
public interface UserInfoMapper {
    @Select("SELECT userPassword FROM userManagement.UserInformation " +
            "WHERE userAccount=#{userAccount}")
    String getPwdFromAccount(@Param("userAccount") String userAccount);

    @Select("SELECT userImg FROM userManagement.UserInformation " +
            "WHERE userAccount=#{userAccount}")
    String getUserImgFromAccount(@Param("userAccount") String userAccount);

    @Select("SELECT userToken FROM userManagement.UserInformation " +
            "WHERE userAccount=#{userAccount}")
    String getUserToken(@Param("userAccount") String userAccount);

    @Select("SELECT * FROM userManagement.UserInformation" +
            " WHERE userAccount=#{userAccount}")
    UserInformation getUserInformation(@Param("userAccount") String userAccount);

}
