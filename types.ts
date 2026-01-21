export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 string for user uploaded images
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export enum QudratQuestionType {
  VerbalAnalogy = 'Verbal Analogy',
  SentenceCompletion = 'Sentence Completion',
  VocabularyMeaning = 'Vocabulary Meaning',
  ContextualMeaning = 'Contextual Meaning',
  ReadingComprehension = 'Reading Comprehension',
  ErrorDetection = 'Error Detection',
  WordRelationship = 'Word Relationship',
}