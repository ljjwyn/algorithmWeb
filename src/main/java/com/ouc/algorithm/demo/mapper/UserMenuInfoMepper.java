package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.UserMenuInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface UserMenuInfoMepper {
    @Select("SELECT * FROM userManagement.userMenuInfo " +
            "WHERE userToken=#{userToken}")
    UserMenuInfo getUserMenu(@Param("userToken") String userToken);
}
