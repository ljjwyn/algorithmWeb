package com.ouc.algorithm.demo.mapper;

import com.ouc.algorithm.demo.entity.basicModel;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component

public interface basicModelMapper {

    @Select("SELECT * FROM webAlgorithm.basicModel")
    List<basicModel> getAllTasks();

    @Update("UPDATE webAlgorithm.basicModel SET modelDefaultConf=#{modelConfId} WHERE id=#{modelId}")
    void updateModelConf(@Param("modelConfId") String confId, @Param("modelId") int modelId);

    @Select("SELECT * FROM webAlgorithm.basicModel WHERE id = #{modelId}")
    basicModel getModelItem(@Param("modelId") int modelId);

    @Select("SELECT * FROM webAlgorithm.basicModel WHERE modelCatalog = #{modelCatalog}")
    List<basicModel> getModelId(@Param("modelCatalog") String modelCatalog);
}
