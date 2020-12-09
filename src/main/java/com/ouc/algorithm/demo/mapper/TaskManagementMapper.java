package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.TaskManagement;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface TaskManagementMapper {
    @Insert("INSERT IGNORE into webAlgorithm.TaskManagement(Uid, TaskName, taskDescription, startDate) " +
            "VALUES (#{taskManagement.Uid}, #{taskManagement.taskName},#{taskManagement.taskDescription}, #{taskManagement.startDate})")
    void createATask(@Param("taskManagement") TaskManagement taskManagement);

    @Select("SELECT * FROM webAlgorithm.TaskManagement")
    List<TaskManagement> getAllTasks();

    @Select("SELECT * FROM webAlgorithm.TaskManagement WHERE Uid = #{taskId}")
    TaskManagement getATask(@Param("taskId") String taskId);

    @Delete("DELETE FROM webAlgorithm.TaskManagement WHERE Uid = #{taskId}")
    void deleteTask(@Param("taskId") String taskId);
}
