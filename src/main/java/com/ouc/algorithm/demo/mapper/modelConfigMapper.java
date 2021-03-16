package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.modelConfig;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface modelConfigMapper {
    @Insert("INSERT IGNORE into webAlgorithm.modelConfig(uid, modelName, configDescription, dataSetName, modelConfMap, modelType, basicModelId) " +
            "VALUES (#{modelconfig.uid}, #{modelconfig.modelName},#{modelconfig.configDescription}, #{modelconfig.dataSetName}, " +
            "#{modelconfig.modelConfMap},#{modelconfig.modelType},#{modelconfig.basicModelId})")
    void createATask(@Param("modelconfig") modelConfig modelconfig);

    @Select("SELECT * FROM webAlgorithm.modelConfig WHERE Uid = #{uid}")
    modelConfig getATask(@Param("uid") String uid);

    @Select("SELECT * FROM webAlgorithm.modelConfig")
    List<modelConfig> getAllModelConfig();

    @Update("UPDATE webAlgorithm.modelConfig SET dataSetName=#{dataSetName},modelConfMap=#{modelConfMap} WHERE uid=#{confId}")
    void updateDataSetName(@Param("dataSetName") String dataSetName, @Param("modelConfMap") String modelConfMap, @Param("confId") String confId);

    @Delete("DELETE FROM webAlgorithm.modelConfig WHERE uid = #{uid}")
    void deleteModelConfig(@Param("uid") String uid);
}
