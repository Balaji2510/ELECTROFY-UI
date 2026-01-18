import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';
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

    constructor(private aiService: AiService, private authService: AuthService) { }

    public loadModel() {
        // No model to load when using the API
        return Promise.resolve();
    }

    public getResponse(message: string): Observable<string> {
        // Handle simple greetings and goodbyes without the model for a more natural feel.
        const lowerCaseMessage = message.toLowerCase();
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
            return of("Hello! How can I help you with our electronics today?");
        }
        if (lowerCaseMessage.includes('bye')) {
            return of("Goodbye! Have a great day.");
        }

        const userId = this.authService.currentUser()?.id;

        return new Observable(observer => {
            this.aiService.chat(message, userId).subscribe({
                next: (response) => {
                    observer.next(response.reply)
                    
                },
                error: (err) => observer.next("I'm having trouble connecting right now. Please try again later."),
                complete: () => observer.complete()
            });
        });
    }
}