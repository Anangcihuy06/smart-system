import { NextRequest, NextResponse } from 'next/server';
import { formatSystemContext } from '@/lib/dataService';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, maxHistory = 20 } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages array' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const systemContext = formatSystemContext();
    
    const systemMessage = `Anda adalah AI Assistant resmi Pemerintah Kabupaten Kebumen.
Nama Anda "Smart AI Kebumen".

Konteks Sistem:
- Smart System Kebumen adalah sistem terintegrasi layanan pemerintah daerah
- Layanan tersedia: KTP, KK, Akta, Izin Usaha, Kesehatan, Sosial
- Warga bisa mengajukan layanan, membuat pengaduan, dan mengakses info publik

${systemContext}

Guidelines:
1. Selalu jawab dalam Bahasa Indonesia yang sopan
2. Gunakan format markdown jika perlu (bold, list, dll)
3. Gunakan data di atas untuk menjawab pertanyaan user
4. Berikan analisis jika ditanya tentang data (tingkat kemiskinan, stunting, dll)
5. Jika ditanya data spesifik yang TIDAK ada di list, katakan bahwa data tersebut dapat dicek di dashboard resmi
6. Berikan informasi akurat tentang prosedur layanan pemerintah`;

    const recentMessages = messages.slice(-maxHistory);
    
    const requestBody = {
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...recentMessages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://smart-system-kebumen.demo',
        'X-Title': 'Smart System Kebumen',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenRouter response:', data);
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
