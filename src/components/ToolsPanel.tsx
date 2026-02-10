import { Heart, Shield, Sparkles, Compass } from './Icons';
import { UserProfile, Message } from '../App';

interface ToolsPanelProps {
  profile: UserProfile;
  setMessages: (messages: Message[]) => void;
  messages: Message[];
}

export function ToolsPanel({ profile, setMessages, messages }: ToolsPanelProps) {
  const handlePromptClick = (prompt: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    
    // Switch to chat view would be handled by parent component
    window.dispatchEvent(new CustomEvent('switch-to-chat'));
  };

  const tools = [
    {
      icon: Heart,
      title: 'Desire Exploration',
      description: 'Understand what you truly want in relationships and life',
      prompts: [
        'What does intimacy mean to you?',
        'What are your non-negotiables in relationships?',
        'What brings you joy outside of relationships?',
      ],
      color: 'from-rose-400 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Boundaries Workshop',
      description: 'Learn to set and communicate healthy boundaries',
      prompts: [
        'Where do you struggle to say no?',
        'What boundaries feel important to you?',
        'How do you want to be treated?',
      ],
      color: 'from-purple-400 to-indigo-500',
    },
    {
      icon: Sparkles,
      title: 'Self-Discovery Journal',
      description: 'Guided prompts for deeper self-understanding',
      prompts: [
        'What version of yourself are you becoming?',
        'What patterns are you noticing?',
        'What do you need to let go of?',
      ],
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: Compass,
      title: 'Values Compass',
      description: 'Identify and align with your core values',
      prompts: [
        'What values guide your decisions?',
        'When do you feel most yourself?',
        'What legacy do you want to create?',
      ],
      color: 'from-teal-400 to-cyan-500',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Exploration Tools</h2>
          <p className="text-gray-600">
            Safe spaces to explore your desires, boundaries, and authentic self
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{tool.title}</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Reflection Prompts
                  </p>
                  {tool.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-2">Your Safe Space</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            These tools are designed to help you explore at your own pace. There's no pressure, no judgment—just gentle guidance as you discover what feels true for you. Click any prompt to start a conversation with Eli about that topic.
          </p>
        </div>
      </div>
    </div>
  );
}