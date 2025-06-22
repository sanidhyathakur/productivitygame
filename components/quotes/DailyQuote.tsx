'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const quotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  }
];

export function DailyQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Get a consistent quote based on the current date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Quote className="h-8 w-8 text-purple-500 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="text-lg italic text-gray-800 leading-relaxed">
              "{quote.text}"
            </p>
            <p className="text-sm font-medium text-purple-600">
              — {quote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}