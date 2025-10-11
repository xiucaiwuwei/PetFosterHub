package org.backend.A_general.base.config.backend;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 消息队列配置类
 * 用于配置RabbitMQ相关的设置
 */
@Configuration
public class MessageQueueConfig {

    // 队列名称常量
    public static final String USER_REGISTER_QUEUE = "user.register.queue";
    public static final String ORDER_CREATE_QUEUE = "order.create.queue";
    public static final String PAYMENT_NOTIFY_QUEUE = "payment.notify.queue";
    public static final String EMAIL_SEND_QUEUE = "email.send.queue";
    public static final String SMS_SEND_QUEUE = "sms.send.queue";
    public static final String AUDIT_LOG_QUEUE = "audit.log.queue";
    
    // 交换机名称常量
    public static final String DIRECT_EXCHANGE = "app.direct.exchange";
    public static final String TOPIC_EXCHANGE = "app.topic.exchange";
    public static final String FANOUT_EXCHANGE = "app.fanout.exchange";
    
    // 路由键常量
    public static final String USER_REGISTER_ROUTING_KEY = "user.register";
    public static final String ORDER_CREATE_ROUTING_KEY = "order.create";
    public static final String PAYMENT_NOTIFY_ROUTING_KEY = "payment.notify";
    public static final String EMAIL_SEND_ROUTING_KEY = "notification.email";
    public static final String SMS_SEND_ROUTING_KEY = "notification.sms";
    public static final String AUDIT_LOG_ROUTING_KEY = "log.audit";

    /**
     * 创建消息转换器
     * 将消息转换为JSON格式
     *
     * @return MessageConverter实例
     */
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * 配置RabbitTemplate
     * 用于发送消息
     *
     * @param connectionFactory 连接工厂
     * @param messageConverter 消息转换器
     * @return RabbitTemplate实例
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        rabbitTemplate.setMandatory(true);
        
        // 设置确认回调和返回回调（可选）
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            if (ack) {
                // 消息发送到交换机成功
                // 可以记录成功日志
                System.out.println("消息发送成功");
            } else {
                // 消息发送失败，可以记录错误日志或重试
                // 处理发送失败的情况
                System.out.println("消息发送失败: " + cause);
            }
        });
        
        rabbitTemplate.setReturnsCallback(returned -> {
            // 消息从交换机路由到队列失败的处理
            // 可以记录错误日志或重试
            System.out.println("消息被退回: " + returned);
        });
        
        return rabbitTemplate;
    }

    /**
     * 配置监听器容器工厂
     * 用于配置消息监听容器
     *
     * @param connectionFactory 连接工厂
     * @param messageConverter 消息转换器
     * @return SimpleRabbitListenerContainerFactory实例
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter messageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        factory.setConcurrentConsumers(1);
        factory.setMaxConcurrentConsumers(5);
        factory.setAcknowledgeMode(AcknowledgeMode.AUTO);
        
        return factory;
    }

    // ==================== 交换机配置 ====================

    /**
     * 创建直接交换机
     * 用于精确匹配路由
     *
     * @return DirectExchange实例
     */
    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange(DIRECT_EXCHANGE, true, false);
    }

    /**
     * 创建主题交换机
     * 用于模糊匹配路由
     *
     * @return TopicExchange实例
     */
    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(TOPIC_EXCHANGE, true, false);
    }

    /**
     * 创建扇形交换机
     * 广播消息到所有绑定的队列
     *
     * @return FanoutExchange实例
     */
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange(FANOUT_EXCHANGE, true, false);
    }

    // ==================== 队列配置 ======================

    /**
     * 创建用户注册队列
     *
     * @return Queue实例
     */
    @Bean
    public Queue userRegisterQueue() {
        return QueueBuilder.durable(USER_REGISTER_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", USER_REGISTER_QUEUE + ".dlq")
                .build();
    }

    /**
     * 创建订单创建队列
     *
     * @return Queue实例
     */
    @Bean
    public Queue orderCreateQueue() {
        return QueueBuilder.durable(ORDER_CREATE_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", ORDER_CREATE_QUEUE + ".dlq")
                .build();
    }

    /**
     * 创建支付通知队列
     *
     * @return Queue实例
     */
    @Bean
    public Queue paymentNotifyQueue() {
        return QueueBuilder.durable(PAYMENT_NOTIFY_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", PAYMENT_NOTIFY_QUEUE + ".dlq")
                .build();
    }

    /**
     * 创建邮件发送队列
     *
     * @return Queue实例
     */
    @Bean
    public Queue emailSendQueue() {
        return QueueBuilder.durable(EMAIL_SEND_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", EMAIL_SEND_QUEUE + ".dlq")
                .build();
    }

    /**
     * 创建短信发送队列
     *
     * @return Queue实例
     */
    @Bean
    public Queue smsSendQueue() {
        return QueueBuilder.durable(SMS_SEND_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", SMS_SEND_QUEUE + ".dlq")
                .build();
    }

    /**
     * 创建审计日志队列
     *
     * @return Queue实例
     */
    @Bean
    public Queue auditLogQueue() {
        return QueueBuilder.durable(AUDIT_LOG_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", AUDIT_LOG_QUEUE + ".dlq")
                .build();
    }

    // ==================== 绑定配置 ======================

    /**
     * 绑定用户注册队列到直接交换机
     *
     * @return Binding实例
     */
    @Bean
    public Binding userRegisterBinding(Queue userRegisterQueue, DirectExchange directExchange) {
        return BindingBuilder.bind(userRegisterQueue)
                .to(directExchange)
                .with(USER_REGISTER_ROUTING_KEY);
    }

    /**
     * 绑定订单创建队列到直接交换机
     *
     * @return Binding实例
     */
    @Bean
    public Binding orderCreateBinding(Queue orderCreateQueue, DirectExchange directExchange) {
        return BindingBuilder.bind(orderCreateQueue)
                .to(directExchange)
                .with(ORDER_CREATE_ROUTING_KEY);
    }

    /**
     * 绑定支付通知队列到直接交换机
     *
     * @return Binding实例
     */
    @Bean
    public Binding paymentNotifyBinding(Queue paymentNotifyQueue, DirectExchange directExchange) {
        return BindingBuilder.bind(paymentNotifyQueue)
                .to(directExchange)
                .with(PAYMENT_NOTIFY_ROUTING_KEY);
    }

    /**
     * 绑定邮件发送队列到主题交换机
     *
     * @return Binding实例
     */
    @Bean
    public Binding emailSendBinding(Queue emailSendQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(emailSendQueue)
                .to(topicExchange)
                .with(EMAIL_SEND_ROUTING_KEY);
    }

    /**
     * 绑定短信发送队列到主题交换机
     *
     * @return Binding实例
     */
    @Bean
    public Binding smsSendBinding(Queue smsSendQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(smsSendQueue)
                .to(topicExchange)
                .with(SMS_SEND_ROUTING_KEY);
    }

    /**
     * 绑定审计日志队列到主题交换机
     *
     * @return Binding实例
     */
    @Bean
    public Binding auditLogBinding(Queue auditLogQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(auditLogQueue)
                .to(topicExchange)
                .with(AUDIT_LOG_ROUTING_KEY);
    }
}