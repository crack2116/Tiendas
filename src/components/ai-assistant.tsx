'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Bot, Send, User, X } from 'lucide-react';
import { generalAssistant } from '@/ai/flows/general-assistant-flow';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await generalAssistant({ query: input });
      const aiMessage: Message = { sender: 'ai', text: result.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        sender: 'ai',
        text: 'Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo de nuevo más tarde.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset chat when opening
      setMessages([]);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={handleToggle}
        >
          {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-md">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="p-0 border-0 shadow-2xl w-full max-w-md flex flex-col h-[60vh]">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="flex items-center gap-2 font-headline">
                            <Bot className="h-6 w-6" />
                            Asistente de Compras IA
                        </DialogTitle>
                        <DialogDescription>
                            ¿Cómo puedo ayudarte hoy?
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div
                            key={index}
                            className={cn(
                                'flex items-start gap-3',
                                msg.sender === 'user' ? 'justify-end' : 'justify-start'
                            )}
                            >
                            {msg.sender === 'ai' && (
                                <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                    <Bot />
                                </AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                'rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap',
                                msg.sender === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                )}
                            >
                                {msg.text}
                            </div>
                             {msg.sender === 'user' && (
                                <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                                </Avatar>
                            )}
                            </div>
                        ))}
                         {loading && (
                            <div className="flex items-start gap-3 justify-start">
                                <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                    <Bot />
                                </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg px-4 py-2 space-y-2">
                                    <Skeleton className="h-3 w-8" />
                                </div>
                            </div>
                        )}
                        </div>
                    </ScrollArea>
                    
                    <DialogFooter className="p-4 border-t">
                        <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex w-full items-center space-x-2"
                        >
                        <Input
                            placeholder="Escribe tu consulta..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" size="icon" disabled={loading}>
                            <Send className="h-4 w-4" />
                        </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      )}
    </>
  );
}
