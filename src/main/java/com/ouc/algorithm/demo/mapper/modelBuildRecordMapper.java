package com.ouc.algorithm.demo.mapper;
import com.ouc.algorithm.demo.entity.ModelBuildRecord;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Mapper
@Component
public interface modelBuildRecordMapper {

    @Select("SELECT * FROM webAlgorithm.modelBuildRecord")
    List<ModelBuildRecord> getAllModelRecord();

    @Select("SELECT * FROM webAlgorithm.modelBuildRecord WHERE modelUid=#{modelUid}")
    ModelBuildRecord getAModelRecord(@Param("modelUid") String modelUid);

    @Insert("INSERT IGNORE into webAlgorithm.modelBuildRecord(modelUid, modelName, modelDescription, basicModelId, modelConfId, startTime, saveModelName) " +
            "VALUES (#{modelbuildRecord.modelUid}, #{modelbuildRecord.modelName},#{modelbuildRecord.modelDescription}, #{modelbuildRecord.basicModelId}" +
            ", #{modelbuildRecord.modelConfId}, #{modelbuildRecord.startTime}, #{modelbuildRecord.saveModelName})")
    void createATask(@Param("modelbuildRecord") ModelBuildRecord modelbuildRecord);

    @Update("UPDATE webAlgorithm.modelBuildRecord SET endTime=#{endTime} WHERE modelUid=#{modelUid}")
    void updateEndTime(@Param("endTime") Date endTime, @Param("modelUid")String modelUid);

    @Update("UPDATE webAlgorithm.modelBuildRecord SET buildingProcess=#{buildingProcess} WHERE modelUid=#{modelUid}")
    void updateProcess(@Param("buildingProcess") Float buildingProcess, @Param("modelUid")String modelUid);

    @Delete("DELETE FROM webAlgorithm.ModelBuildRecord WHERE modelUid = #{modelUid}")
    void deleteModel(@Param("modelUid") String modelUid);


}
