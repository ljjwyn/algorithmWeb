package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.textDataSet;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface textDataSetMapper {
    @Select("SELECT * FROM webAlgorithm.textDataSet")
    List<textDataSet> getAllDataSets();

    @Select("SELECT dataSetName FROM webAlgorithm.textDataSet WHERE dataSetCatalog=#{dataSetType}")
    List<String> getDataSetType(@Param("dataSetType") String dataSetType);

    @Insert("INSERT IGNORE into webAlgorithm.textDataSet(dataSetName, dataSetCatalog, dataSetDescription, dataSetPath, createTime) " +
            "VALUES (#{textdataSet.dataSetName}, #{textdataSet.dataSetCatalog},#{textdataSet.dataSetDescription},#{textdataSet.dataSetPath}" +
            ",#{textdataSet.createTime})")
    int createATask(@Param("textdataSet") textDataSet textdataSet);

    @Delete("DELETE FROM webAlgorithm.textDataSet WHERE id = #{id}")
    void deleteDataSet(@Param("id") int id);
}