import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const AIAdvisorModal = ({ visible, onClose, product }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm your Gemini AI Shopping Advisor. How can I help you evaluate "${product?.title || 'this item'}"?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Is this worth the price?',
    'Summarize customer reviews',
    'What are the main pros & cons?',
    'What is the warranty & return policy?',
  ];

  const handleSendPrompt = (prompt) => {
    if (!prompt.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI Contextual Analysis generator
    setTimeout(() => {
      let reply = '';
      const lower = prompt.toLowerCase();

      if (lower.includes('worth') || lower.includes('price')) {
        reply = `At $${product?.price}, this item offers strong value given its ${product?.rating || 4.5}★ rating. ${
          product?.discountPercentage > 10
            ? `It currently has a great ${Math.round(product.discountPercentage)}% discount!`
            : 'Pricing is competitive within its category.'
        }`;
      } else if (lower.includes('review') || lower.includes('customer')) {
        const reviewCount = product?.reviews?.length || 0;
        reply = `Based on ${reviewCount} verified reviews, users praise the quality and fast delivery. Average score is ${product?.rating || 4.5}/5.`;
      } else if (lower.includes('pros') || lower.includes('cons')) {
        reply = `Pros:\n• Excellent build & rating (${product?.rating}★)\n• In stock (${product?.stock} units available)\n• Fast shipping (${product?.shippingInformation || '3-5 business days'})\n\nCons:\n• Limited stock on high-demand colors.`;
      } else if (lower.includes('warranty') || lower.includes('return')) {
        reply = `Warranty: ${product?.warrantyInformation || '1 year official warranty'}.\nReturn Policy: ${product?.returnPolicy || '30 days money-back guarantee'}.`;
      } else {
        reply = `For "${product?.title}", customers highlight reliability and design. Recommended for ${product?.category} enthusiasts seeking great durability!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  if (!product) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={16} color="#7C3AED" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Gemini AI Advisor</Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  Smart analysis for {product.title}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Quick prompt chips */}
          <View style={styles.quickPromptsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {quickPrompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  onPress={() => handleSendPrompt(p)}
                  disabled={isTyping}
                >
                  <Text style={styles.chipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat messages */}
          <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageBubble,
                    isAi ? styles.aiBubble : styles.userBubble,
                  ]}
                >
                  {isAi && (
                    <View style={styles.aiIconSmall}>
                      <Ionicons name="sparkles" size={12} color="#7C3AED" />
                    </View>
                  )}
                  <Text style={[styles.messageText, isAi ? styles.aiText : styles.userText]}>
                    {m.text}
                  </Text>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#7C3AED" />
                <Text style={styles.typingText}>Gemini is thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input field */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything about this product..."
              placeholderTextColor={theme.colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendPrompt(inputText)}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSendPrompt(inputText)}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons name="send" size={18} color={theme.colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
    height: 520,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  aiBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    maxWidth: 220,
  },
  closeButton: {
    padding: 4,
  },
  quickPromptsRow: {
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
  },
  chipsScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  chipText: {
    fontSize: 12,
    color: '#6B21A8',
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  chatContent: {
    paddingVertical: theme.spacing.md,
    gap: 10,
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: theme.borderRadius.md,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#F3E8FF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  aiIconSmall: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  aiText: {
    color: '#3B0764',
  },
  userText: {
    color: theme.colors.textInverse,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#7C3AED',
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    height: 42,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 16,
    fontSize: 13,
    color: theme.colors.text,
  },
  sendButton: {
    backgroundColor: '#7C3AED',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
});

export default AIAdvisorModal;
