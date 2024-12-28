package com.chatter.controller;

import com.chatter.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {

    @GetMapping("/")
    public String login() {
        return "index";
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String username, Model model) {
        model.addAttribute("username", username);

        return "chatroom";
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage send(ChatMessage message) throws Exception {
        return new ChatMessage(
                HtmlUtils.htmlEscape(message.getUsername()),
                HtmlUtils.htmlEscape(message.getContent())
        );
    }

    @MessageMapping("/leave")
    @SendTo("/topic/messages")
    public ChatMessage leave(ChatMessage message) throws Exception {
        return new ChatMessage(
                HtmlUtils.htmlEscape(message.getUsername()),
                HtmlUtils.htmlEscape(message.getUsername() + "has left the chat")
        );
    }

}
