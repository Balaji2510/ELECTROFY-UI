import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ChatbotService, ChatMessage } from './chatbot.service';

@Component({
  selector: 'app-aichatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  template: `
    <div class="chatbot-wrapper">
      <!-- Chat Popup Window -->
      @if (isOpen) {
        <div class="chatbot-container">
          <div class="chatbot-header">
            <h2>Electrofy AI Assistant</h2>
            <button class="close-btn" (click)="toggleChat()" aria-label="Close chat">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="chatbot-messages" #scrollMe>
            <div *ngFor="let message of messages" class="message" [ngClass]="{'user-message': message.sender === 'user', 'bot-message': message.sender === 'bot'}">
              <p>{{ message.text }}</p>
            </div>
            @if (isBotTyping) {
              <div class="message bot-message typing-indicator"><span></span><span></span><span></span></div>
            }
          </div>
          <div class="chatbot-input">
            <input type="text" [(ngModel)]="userMessage" (keyup.enter)="sendMessage()" placeholder="Type a message..." />
            <button (click)="sendMessage()">Send</button>
          </div>
        </div>
      }

      <!-- Floating Toggle Button -->
      <button class="chat-toggle-btn" (click)="toggleChat()" aria-label="Toggle chat">
        <mat-icon>{{ isOpen ? 'close' : 'chat' }}</mat-icon>
      </button>
  `,
  styles: [`
    .chatbot-wrapper {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .chatbot-container {
      width: 400px;
      height: 500px;
      border: 1px solid #ccc;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: sans-serif;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      transform-origin: bottom right;
    }
    .chatbot-header {
      background-color: #007bff;
      color: white;
      padding: 10px;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chatbot-header h2 {
      margin: 0;
      font-size: 1.1rem;
      flex-grow: 1;
      text-align: center;
      padding-left: 32px; /* to balance the close button */
    }
    .close-btn {
      background: none; border: none; color: white; cursor: pointer;
    }
    .chatbot-messages {
      flex-grow: 1;
      padding: 10px;
      overflow-y: auto;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
    }
    .message { max-width: 75%; padding: 8px 12px; border-radius: 15px; margin-bottom: 10px; }
    .user-message { background-color: #007bff; color: white; align-self: flex-end; border-bottom-right-radius: 0; }
    .bot-message { background-color: #e9e9eb; color: #333; align-self: flex-start; border-bottom-left-radius: 0; }
    .typing-indicator { padding: 15px; display: flex; align-items: center; }
    .typing-indicator span { height: 8px; width: 8px; background-color: #999; border-radius: 50%; display: inline-block; margin: 0 2px; animation: bounce 1.3s infinite; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    .chatbot-input { display: flex; padding: 10px; border-top: 1px solid #ccc; background-color: #f9f9f9;}
    .chatbot-input input { flex-grow: 1; border: 1px solid #ccc; border-radius: 20px; padding: 10px; margin-right: 10px; }
    .chatbot-input button { background-color: #007bff; color: white; border: none; border-radius: 20px; padding: 10px 15px; cursor: pointer; }
    .chatbot-input button:hover { background-color: #0056b3; }

    .chat-toggle-btn {
      background-color: #007bff;
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .chat-toggle-btn:hover {
      background-color: #0056b3;
    }
  `],
})
export class Aichatbot implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  public isOpen = false;
  messages: ChatMessage[] = [];
  userMessage: string = '';
  isBotTyping = false;

  constructor(private chatbotService: ChatbotService, private zone: NgZone) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.zone.run(() => {
        this.playSound();
        if (!this.isOpen) {
          this.isOpen = true;
        }
      });
    }, 5000);
    this.chatbotService.loadModel();
    this.messages.push({ sender: 'bot', text: 'Hello! How can I assist you today?' });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.playSound();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ sender: 'user', text: this.userMessage });
    const userMsg = this.userMessage;
    this.userMessage = '';

    // Show typing indicator immediately
    this.isBotTyping = true;

    const botResponse = await this.chatbotService.getResponse(userMsg);
    this.isBotTyping = false;
    this.messages.push({ sender: 'bot', text: botResponse });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  private playSound(): void {
    // Using a free, open-source sound from Pixabay.
    const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a');
    audio.play().catch(error => {
      // Autoplay was prevented. This is common in browsers.
      // The user must interact with the page first.
      console.log('Chatbot sound was blocked by the browser.');
    });
  }
}
