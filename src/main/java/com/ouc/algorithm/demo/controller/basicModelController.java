package com.ouc.algorithm.demo.controller;
import com.ouc.algorithm.demo.entity.basicModel;
import com.ouc.algorithm.demo.mapper.basicModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/basicmodel")
public class basicModelController {
    private static final Logger log = LoggerFactory.getLogger(basicModel.class);

    @Autowired
    private basicModelMapper basicmodelMapper;

    @RequestMapping(value = "/updateconf", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> insertSql(@RequestBody Map<String, Object> resquestParams) throws Exception {
        //Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        basicmodelMapper.updateModelConf((String)resquestParams.get("confUid"),Integer.parseInt(String.valueOf(resquestParams.get("modelId"))));
        Map<String,String> res = new HashMap<>();
        res.put("state","finished");
        return res;
    }

    @RequestMapping(value = "/getmodelitem", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public basicModel getModelItem(@RequestBody Map<String, Integer> resquestParams) throws Exception{
        basicModel resItem = basicmodelMapper.getModelItem(resquestParams.get("modelId"));
        return resItem;
    }

    @RequestMapping(value = "/getmodelid", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public List<basicModel> getModelId(@RequestBody Map<String, String> resquestParams) throws Exception{
        List<basicModel> resBasicModel = basicmodelMapper.getModelId(resquestParams.get("modelCatalog"));
        return resBasicModel;
    }

}
