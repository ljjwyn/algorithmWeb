package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.UserRoleInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface UserRoleInfoMapper {
    @Select("SELECT * FROM userManagement.userRoleInfo " +
            "WHERE token=#{userToken}")
    UserRoleInfo getUserRole(@Param("userToken") String userToken);
}
