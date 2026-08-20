import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import Icon from '../components/Icon';

const PRESETS = [
  { q: 'How many kicks are normal?', a: 'Typically, healthcare providers recommend tracking kicks in the third trimester. Aiming for 10 movements/kicks within a 2-hour window is a common standard. If you notice a sudden drop or change, contact your doctor immediately.' },
  { q: 'What foods should I avoid?', a: 'It is best to avoid raw or undercooked meats, fish with high mercury levels, unpasteurized dairy (raw milk, soft cheeses like brie unless pasteurized), raw eggs, and pre-packaged deli salads to prevent foodborne illness.' },
  { q: 'Can I drink coffee?', a: 'Yes, but in moderation. Most experts (like the American College of Obstetricians and Gynecologists) suggest limiting caffeine to less than 200 mg per day, which is roughly one 12 oz cup of brewed coffee.' },
  { q: 'When should I call the doctor?', a: 'Seek immediate medical attention if you experience: heavy vaginal bleeding, fluid leakage, severe abdominal pain, severe headache that does not respond to acetaminophen, sudden face/hand swelling, or a distinct decrease in baby\'s movements.' },
  { q: 'Is back pain normal?', a: 'Yes, very common as your body\'s center of gravity shifts and hormones loosen your joints. Gentle stretches, sleeping on your side with a pregnancy pillow, and avoiding heavy lifting can help ease the strain.' },
];

export default function ChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: 'Hello! I am your Bloom Pregnancy Assistant. Ask me anything about your baby\'s wellbeing, pregnancy symptoms, nutrition, or the monitoring belt.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const getBotResponse = (userText) => {
    const text = userText.toLowerCase();
    
    // Find preset match
    const preset = PRESETS.find(p => text.includes(p.q.toLowerCase()) || p.q.toLowerCase().split(' ').some(word => word.length > 4 && text.includes(word)));
    if (preset) return preset.a;

    // Keyword matching rules
    if (text.includes('kick') || text.includes('movement') || text.includes('kicking')) {
      return 'Fetal movement is a key indicator of your baby\'s health. Try tracking kicks at the same time each day (when the baby is active). If you count fewer than 10 kicks in 2 hours, drink some cold water, lie on your left side, and count again. Call your OB/GYN if activity remains low.';
    }
    if (text.includes('food') || text.includes('eat') || text.includes('diet') || text.includes('nutrition')) {
      return 'Focus on nutrient-dense foods: leafy greens (folate), lean proteins, whole grains, and iron-rich lentils. Stay hydrated by drinking plenty of water throughout the day. Avoid unpasteurized foods, raw seafood, and excess caffeine.';
    }
    if (text.includes('coffee') || text.includes('caffeine') || text.includes('tea')) {
      return 'Caffeine crosses the placenta, so it is recommended to keep daily intake under 200 mg. This equals roughly one mug of coffee or two cups of black tea. Check labels on sodas and energy drinks, which can also be high in caffeine.';
    }
    if (text.includes('belt') || text.includes('esp32') || text.includes('sensor') || text.includes('device')) {
      return 'The Fetal Care Belt monitors the baby\'s heartbeat and movements using piezo sensors. Enter the belt\'s IP address in Settings. Once connected, live heart rate data displays on your Home dashboard, and kicks sync automatically.';
    }
    if (text.includes('sleep') || text.includes('lying') || text.includes('position')) {
      return 'From the second trimester onward, sleeping on your side (especially the left side) is recommended. It optimizes blood flow and oxygen delivery to the placenta and prevents the uterus from pressing on major blood vessels.';
    }
    if (text.includes('danger') || text.includes('warning') || text.includes('emergency') || text.includes('pain') || text.includes('bleeding')) {
      return 'If you experience sudden severe swelling, persistent severe headaches, changes in vision, heavy bleeding, or fluid leakage, contact your doctor or visit emergency care immediately. This assistant is for informational support only.';
    }

    return 'I want to help, but for specific medical concerns about your baby, it is always safest to consult your doctor. You can ask me about: kick counting, foods to avoid, sleeping positions, caffeine guidelines, or how the monitoring belt works.';
  };

  const handleSend = (textToSend) => {
    const cleanText = textToSend || input.trim();
    if (!cleanText) return;

    const userMessage = {
      id: Math.random().toString(),
      text: cleanText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay for realistic interaction
    setTimeout(() => {
      const botReply = {
        id: Math.random().toString(),
        text: getBotResponse(cleanText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 850);
  };

  useEffect(() => {
    // Scroll to end when messages update
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.botAvatar, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="message" size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={[type.bodyBold, { color: colors.text }]}>Pregnancy Assistant</Text>
          <Text style={[type.micro, { color: colors.textMuted }]}>Bloom Local AI Guidance</Text>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
              {!isUser && (
                <View style={[styles.avatarMini, { backgroundColor: colors.primary + '10' }]}>
                  <Icon name="baby" size={12} color={colors.primary} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
                    : { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
                  shadow(colors.cardShadow),
                ]}
              >
                <Text style={[type.body, { color: isUser ? '#fff' : colors.text }]}>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
        ListFooterComponent={() =>
          isTyping ? (
            <View style={styles.typingContainer}>
              <View style={[styles.avatarMini, { backgroundColor: colors.primary + '10' }]}>
                <Icon name="baby" size={12} color={colors.primary} />
              </View>
              <View style={[styles.bubble, styles.typingBubble, { backgroundColor: colors.surface }]}>
                <ActivityIndicator size="small" color={colors.primary} style={{ transform: [{ scale: 0.8 }] }} />
              </View>
            </View>
          ) : null
        }
      />

      {/* Input Area */}
      <View style={[styles.inputPanel, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        {messages.length < 3 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
            {PRESETS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetChip, { borderColor: colors.border, backgroundColor: colors.bg }]}
                onPress={() => handleSend(p.q)}
              >
                <Text style={[type.caption, { color: colors.text }]}>{p.q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.bg }]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about kicks, food rules, belt..."
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            onPress={() => handleSend()}
            activeOpacity={0.8}
          >
            <Icon name="check" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: space.md, borderBottomWidth: 1 },
  botAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  listContent: { padding: space.md, paddingBottom: space.xl },
  messageRow: { flexDirection: 'row', marginVertical: space.sm, maxWidth: '80%' },
  userRow: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  botRow: { alignSelf: 'flex-start', justifyContent: 'flex-start' },
  avatarMini: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 6, marginTop: 4 },
  bubble: { borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 10 },
  typingContainer: { flexDirection: 'row', alignSelf: 'flex-start', marginVertical: space.sm },
  typingBubble: { paddingHorizontal: space.lg, paddingVertical: 12 },
  inputPanel: { padding: space.md },
  presetsScroll: { flexDirection: 'row', marginBottom: space.sm },
  presetChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 6, marginRight: space.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1.5, borderRadius: radius.lg, paddingHorizontal: space.md, paddingVertical: 10, fontSize: 14, marginRight: space.sm },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
