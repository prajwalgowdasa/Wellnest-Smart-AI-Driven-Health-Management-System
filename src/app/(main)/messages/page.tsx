"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Search, Send, User, UserPlus } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  lastActive?: Date;
  isOnline?: boolean;
}

export default function MessagesPage() {
  // Sample data for contacts/doctors
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "General Practitioner",
      isOnline: true,
      lastActive: new Date(),
    },
    {
      id: "2",
      name: "Dr. Michael Wong",
      role: "Dentist",
      isOnline: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "3",
      name: "Dr. Lisa Anderson",
      role: "Cardiologist",
      isOnline: false,
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "4",
      name: "Health Support Team",
      role: "Customer Service",
      isOnline: true,
      lastActive: new Date(),
    },
  ]);

  // Sample messages
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1",
        senderId: "1",
        receiverId: "user",
        content: "Hello! How can I help you today?",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "m2",
        senderId: "user",
        receiverId: "1",
        content:
          "Hi Dr. Johnson, I've been experiencing some mild headaches in the mornings. Should I be concerned?",
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        read: true,
      },
      {
        id: "m3",
        senderId: "1",
        receiverId: "user",
        content:
          "It could be due to various factors like stress, dehydration, or sleep issues. Are you drinking enough water throughout the day?",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true,
      },
      {
        id: "m4",
        senderId: "user",
        receiverId: "1",
        content:
          "I probably don't drink as much water as I should. I'll try to increase my water intake and see if it helps.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
      },
      {
        id: "m5",
        senderId: "1",
        receiverId: "user",
        content:
          "That's a good start. Aim for 8 glasses a day. If the headaches persist for more than a week, please schedule an appointment for a proper evaluation.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: true,
      },
    ],
    "4": [
      {
        id: "m6",
        senderId: "4",
        receiverId: "user",
        content:
          "Hello! This is the Health Support Team. We noticed you haven't had a check-up in the past year. Would you like to schedule an annual examination?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ],
  });

  // UI states
  const [selectedContact, setSelectedContact] = useState<string>("1");
  const [messageInput, setMessageInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "user",
      receiverId: selectedContact,
      content: messageInput,
      timestamp: new Date(),
      read: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMessage],
    }));

    setMessageInput("");

    // Simulate response after 1-3 seconds
    if (Math.random() > 0.3) {
      // 70% chance of getting a response
      const responseDelay = 1000 + Math.random() * 2000;

      setTimeout(() => {
        const responses = [
          "Thank you for your message. I'll review it and get back to you soon.",
          "Got it. Is there anything else you'd like to discuss?",
          "I've noted your concerns. Let's discuss this further at your next appointment.",
          "Thanks for the update. Remember to keep tracking your symptoms in the app.",
        ];

        const responseMessage: Message = {
          id: `m${Date.now()}`,
          senderId: selectedContact,
          receiverId: "user",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          read: true,
        };

        setMessages((prev) => ({
          ...prev,
          [selectedContact]: [
            ...(prev[selectedContact] || []),
            responseMessage,
          ],
        }));
      }, responseDelay);
    }
  };

  // Format date/time for display
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="grid h-[calc(100vh-220px)] grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
        {/* Contacts sidebar */}
        <Card className="flex h-full flex-col">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search contacts..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <ul className="divide-y">
              {filteredContacts.map((contact) => (
                <li key={contact.id}>
                  <button
                    className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted ${
                      selectedContact === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {contact.avatarUrl ? (
                        <img
                          src={contact.avatarUrl}
                          alt={contact.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                      {contact.isOnline && (
                        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.lastActive &&
                            formatMessageTime(contact.lastActive)}
                        </p>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {contact.role}
                      </p>
                      {messages[contact.id]?.length > 0 && (
                        <p className="mt-1 truncate text-xs">
                          {
                            messages[contact.id][
                              messages[contact.id].length - 1
                            ].content
                          }
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="flex h-full flex-col">
          <CardHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
                {contacts.find((c) => c.id === selectedContact)?.isOnline && (
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {contacts.find((c) => c.id === selectedContact)?.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {contacts.find((c) => c.id === selectedContact)?.role}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {(messages[selectedContact] || []).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.senderId === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`mt-1 text-right text-xs ${
                        message.senderId === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {!messages[selectedContact]?.length && (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="mb-1 text-lg font-medium">No messages yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with{" "}
                    {contacts.find((c) => c.id === selectedContact)?.name}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Message ${
                  contacts.find((c) => c.id === selectedContact)?.name
                }...`}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Messages are end-to-end encrypted and comply with HIPAA
              regulations.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
