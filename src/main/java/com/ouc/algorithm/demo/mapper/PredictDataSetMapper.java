package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.ModelBuildRecord;
import com.ouc.algorithm.demo.entity.PredictDataSet;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface PredictDataSetMapper {

    @Insert("INSERT IGNORE into webAlgorithm.predictDataSet(taskUid, dataSetName, dataSetDescription, " +
            "useModelName, createTime) VALUES (#{predictDataSet.taskUid}, #{predictDataSet.dataSetName}," +
            "#{predictDataSet.dataSetDescription}, #{predictDataSet.useModelName}, #{predictDataSet.createTime})")
    int createAPredictDataSet(@Param("predictDataSet") PredictDataSet predictDataSet);

    @Select("SELECT * FROM webAlgorithm.predictDataSet")
    List<PredictDataSet> getAllPredictDataSet();

    @Select("SELECT * FROM webAlgorithm.predictDataSet WHERE taskUid = #{taskUid}")
    PredictDataSet getAPredictDataSet(@Param("taskUid") String taskUid);
}
