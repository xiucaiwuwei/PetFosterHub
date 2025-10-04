package org.backend.event;

import org.backend.entity.Message;
import org.springframework.context.ApplicationEvent;

/**
 * 新消息事件类，用于在应用程序中发布新消息事件
 * 该类继承自Spring的ApplicationEvent，可以在Spring事件机制中使用
 */
public class NewMessageEvent extends ApplicationEvent {
    private final Message message;

    /**
     * 构造一个新的消息事件
     * 
     * @param message 新消息对象，不能为null
     */
    public NewMessageEvent(Message message) {
        super(message);
        this.message = message;
    }

    /**
     * 获取事件中的消息对象
     * 
     * @return 消息对象
     */
    public Message getMessage() {
        return message;
    }
}