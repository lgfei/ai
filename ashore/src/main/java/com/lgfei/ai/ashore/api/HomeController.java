package com.lgfei.ai.ashore.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author lgfei
 * @date 2025/6/21 16:00
 */
@Controller
@RequestMapping("/web")
public class HomeController {

    @GetMapping("/home")
    public String home() {
        return "home";
    }
}
