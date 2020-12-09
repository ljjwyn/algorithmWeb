package com.ouc.algorithm.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface MySQLToolsMapper {

    // 列出指定库中所有表及其注释
    @Select("SELECT TABLE_NAME AS 'name',TABLE_COMMENT AS 'comment' FROM information_schema.TABLES WHERE table_schema=#{dbName}")
    List<Map<String, Object>> showTables(@Param("dbName") String dbName);

    // 列出指定库-表中字段名、注释及字段类型
    @Select("SELECT COLUMN_NAME as 'name', COLUMN_COMMENT AS 'comment', COLUMN_TYPE AS 'type' FROM INFORMATION_SCHEMA.Columns " +
            "WHERE table_name=#{tableName} AND table_schema=#{dbName}")
    List<Map<String, Object>> getColumnNameCommentAndType(@Param("tableName") String tableName,
                                                          @Param("dbName") String dbName);

    // 在指定库中创建一个新表，并从源库-表中复制所有数据及表结构到新表
    @Select("CREATE TABLE `${targetDB}`.`${targetTB}` AS SELECT * FROM `${sourceDB}`.`${sourceTB}`;")
    void copyTable(@Param("sourceDB") String sourceDB, @Param("sourceTB") String sourceTB,
                   @Param("targetDB") String targetDB, @Param("targetTB") String targetTB);

    // 更改表注释
    @Select("alter table `${targetDB}`.`${targetTB}` comment #{comment}")
    void modifyComment(@Param("targetDB") String targetDB, @Param("targetTB") String targetTB,
                       @Param("comment") String comment);

    // 删除指定库中的表
    @Select("DROP TABLE `${targetDB}`.`${targetTB}`")
    void dropTable(@Param("targetDB") String targetDB, @Param("targetTB") String targetTB);

    @Select("SELECT * FROM data_analysis_db.subject_db_info")
    List<Map<String, Object>> getAllSubjectDBs();

}
