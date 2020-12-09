package com.ouc.algorithm.demo.interceptors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.util.Enumeration;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    private static final Logger log = LoggerFactory.getLogger(LoginInterceptor.class);


    //这个方法是在访问接口之前执行的，我们只需要在这里写验证登陆状态的业务逻辑，就可以在用户调用指定接口之前验证登陆状态了
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //每一个项目对于登陆的实现逻辑都有所区别，我这里使用最简单的Session提取User来验证登陆。
        HttpSession session = request.getSession();
        Cookie[] test2 = request.getCookies();
        if(test2==null){
            log.warn("未获取到cookie");
        }else {
            log.warn("有cookie");
        }
        // 由于xhr在post等跨域情况下需要用options请求试探，
        // 如果不放行会拦截正常请求，这里很重要
        if(request.getMethod().equals("OPTIONS")){
            return true;
        }else if(request.getMethod().equals("POST")){
            log.info("post");
        }
        System.out.println("拦截器中的session的id是====" + session.getId());
        if (session.getAttribute("user") != null){
            log.info("用户已登录，登录的用户是{}",session.getAttribute("user"));
            return true;
        }
        // session过期了
        log.info("用户未登录或超时");
        //获得字符输出流
//        PrintWriter writer = response.getWriter();
//        //字符流输出
//        writer.write("expire");
//        response.addHeader("state","expire");
        //TODO 看老代码的布局先关闭拦截器
        return true;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
    }
}
