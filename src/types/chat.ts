export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  showInsight?: boolean;
};

export type ChatTurn = {
  role: 'user' | 'assistant';
  text: string;
};
