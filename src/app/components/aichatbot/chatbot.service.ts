import { Injectable } from '@angular/core';
import { QuestionAndAnswer, load } from '@tensorflow-models/qna';

export interface Intent {
    tag: string;
    patterns: string[];
    responses: string[];
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private model: QuestionAndAnswer | null = null;
    private knowledgeBase: string = '';

    constructor() { }

    public async loadModel() {
        try {
            this.buildKnowledgeBase();
            this.model = await load();
            console.log('Chatbot Q&A model loaded.');
        } catch (error) {
            console.error('Error loading chatbot model or data:', error);
        }
    }

    private buildKnowledgeBase(): void {
        // This passage is what the Q&A model will use to find answers.
        this.knowledgeBase = `
            Welcome to Electrofy! We are happy to help you.
            We sell a wide variety of consumer electronics, including products ranging from laptops to smart home devices.
            For payments, we accept VISA, Mastercard, and Paypal. We accept most major credit cards.
            Regarding delivery, shipping takes 2-4 business days. We ship all items within 4 business days.
            If you need to say goodbye, you can just say bye.
            Thank you for visiting our store.
        `;
    }

    public async getResponse(message: string): Promise<string> {
        if (!this.model) {
            return "I'm still warming up. Please try again in a moment.";
        }

        // Handle simple greetings and goodbyes without the model for a more natural feel.
        const lowerCaseMessage = message.toLowerCase();
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
            return "Hello! How can I help you with our electronics today?";
        }
        if (lowerCaseMessage.includes('bye')) {
            return "Goodbye! Have a great day.";
        }

        try {
            const answers = await this.model.findAnswers(message, this.knowledgeBase);

            if (answers && answers.length > 0) {
                // Sort answers by score and return the best one.
                const bestAnswer = answers.sort((a, b) => b.score - a.score)[0];
                return bestAnswer.text;
            }
        } catch (error) {
            console.error('Error finding answer:', error);
            return "I encountered an issue while trying to understand that. Please try again.";
        }

        return "I'm not sure how to respond to that. Can you try asking another way?";
    }
}