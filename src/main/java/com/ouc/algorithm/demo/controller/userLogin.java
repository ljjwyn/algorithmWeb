package com.ouc.algorithm.demo.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ouc.algorithm.demo.entity.RequestParam;
import com.ouc.algorithm.demo.entity.UserInformation;
import com.ouc.algorithm.demo.entity.UserMenuInfo;
import com.ouc.algorithm.demo.entity.UserRoleInfo;
import com.ouc.algorithm.demo.mapper.UserInfoMapper;
import com.ouc.algorithm.demo.mapper.UserMenuInfoMepper;
import com.ouc.algorithm.demo.mapper.UserRoleInfoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class userLogin {
    private static final Logger log = LoggerFactory.getLogger(userLogin.class);


    @Autowired
    UserInfoMapper userInfoMapper;

    @Autowired
    UserMenuInfoMepper userMenuInfoMepper;

    @Autowired
    UserRoleInfoMapper userRoleInfoMapper;


    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> userLogin(HttpSession session, @RequestBody RequestParam requestParam) {
        Map<String, Object> resultMap = new HashMap<>();
        String userPassword = requestParam.getUserPassword();
        String userAccount = requestParam.getUserAccount();
        String searchPwd = userInfoMapper.getPwdFromAccount(userAccount);
        if (searchPwd == null) {
            log.info("账号错误或未注册");
            resultMap.put("code", 401);
            resultMap.put("message", "账号错误或未注册");
        } else if (userPassword.equals(searchPwd)) {
            log.info("登录成功");
            resultMap.put("code", 200);
            resultMap.put("message", "登录成功");
            Map<String, String> userToken = new HashMap<>();
            userToken.put("token", userInfoMapper.getUserToken(userAccount));
            userToken.put("userImg", userInfoMapper.getUserImgFromAccount(userAccount));
            resultMap.put("data", userToken);

            session.setAttribute("user", userAccount);
            log.warn("登录的sessionid:{}", session.getId());
        } else {
            log.info("密码错误");
            resultMap.put("code", 402);
            resultMap.put("message", "密码错误");
        }
        return resultMap;
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    @ResponseBody
    public String userLogout(HttpSession session) {
        session.removeAttribute("user");
        return "redirect:login.html";
    }

    @RequestMapping(value = "/user/info", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getUserInfo(@RequestBody Map<String, String> requestParam) {
        Map<String, Object> responseParam = new HashMap<>();
        String userToken = requestParam.get("token");
        if (userToken.equals("admin-token")) {
            log.info("管理员权限");
            responseParam.put("code", 20000);
            UserRoleInfo userRoleInfo = userRoleInfoMapper.getUserRole(userToken);
            responseParam.put("data", userRoleInfo);
        } else if ((userToken.equals("editor-token"))) {
            log.info("编辑者权限");
            responseParam.put("code", 20000);
            UserRoleInfo userRoleInfo = userRoleInfoMapper.getUserRole(userToken);
            responseParam.put("data", userRoleInfo);
        } else {
            log.info("参数解析错误，没有权限");
            responseParam.put("code", 500);
        }
        return responseParam;
    }

    @RequestMapping(value = "/userinformation", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getUserInformation(@RequestBody Map<String, String> requsetParam) {
        Map<String, Object> responseParam = new HashMap<>();
        if (requsetParam == null) {
            responseParam.put("code", 501);
            responseParam.put("state", "error");
            responseParam.put("message", "入参为空");
        } else {
            String userAccount = requsetParam.get("userAccount");
            if (userAccount == null) {
                responseParam.put("code", 502);
                responseParam.put("state", "error");
                responseParam.put("message", "userAccount为空");
            } else {
                UserInformation userInformation = userInfoMapper.getUserInformation(userAccount);
                if (userInformation == null) {
                    responseParam.put("code", 503);
                    responseParam.put("state", "error");
                    responseParam.put("message", "用户账号信息为空");
                } else {
                    responseParam.put("code", 200);
                    responseParam.put("state", "success");
                    responseParam.put("message", "成功");
                    responseParam.put("data", userInformation);
                }
            }
        }
        return responseParam;
    }

    @RequestMapping(value = "/menus", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getUserMenus(@RequestBody Map<String, String> requestParam) {
        Map<String, Object> responseParam = new HashMap<>();
        String userToken = requestParam.get("token");
        if (userToken.equals("admin-token")) {
            UserMenuInfo userMenuInfo = userMenuInfoMepper.getUserMenu(userToken);
            JSONArray userMenuJson = JSONObject.parseArray(userMenuInfo.getUserMenuJson());
            log.info("管理员目录");
            responseParam.put("code", 20000);
            responseParam.put("data", userMenuJson);
        } else if ((userToken.equals("editor-token"))) {
            UserMenuInfo userMenuInfo = userMenuInfoMepper.getUserMenu(userToken);
            JSONArray userMenuJson = JSONObject.parseArray(userMenuInfo.getUserMenuJson());
            log.info("编辑者目录");
            responseParam.put("code", 20000);
            responseParam.put("data", userMenuJson);
        } else {
            log.info("参数解析错误，没有对应目录");
            responseParam.put("code", 500);
        }
        return responseParam;
    }


}
