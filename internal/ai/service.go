package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type Service struct {
	apiKey string
}

func NewService() *Service {
	return &Service{
		apiKey: os.Getenv("OPENAI_API_KEY"),
	}
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type ChatResponse struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error"`
}

func (s *Service) GenerateEmailContent(goal string) (string, string, error) {
	if s.apiKey == "" {
		return "", "", fmt.Errorf("OpenAI API key not configured")
	}

	prompt := fmt.Sprintf("Draft a professional marketing email for the following goal: %s. Return a JSON object with 'subject' and 'html_content' keys. Ensure the content is engaging and use HTML formatting.", goal)

	reqBody := ChatRequest{
		Model: "gpt-3.5-turbo",
		Messages: []Message{
			{Role: "system", Content: "You are a helpful email marketing assistant. Always respond with valid JSON containing 'subject' and 'html_content'."},
			{Role: "user", Content: prompt},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", "", err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errResp ChatResponse
		json.NewDecoder(resp.Body).Decode(&errResp)
		if errResp.Error != nil {
			return "", "", fmt.Errorf("OpenAI error: %s", errResp.Error.Message)
		}
		return "", "", fmt.Errorf("OpenAI API returned status %d", resp.StatusCode)
	}

	var chatResp ChatResponse
	if err := json.NewDecoder(resp.Body).Decode(&chatResp); err != nil {
		return "", "", err
	}

	if len(chatResp.Choices) == 0 {
		return "", "", fmt.Errorf("no response from OpenAI")
	}

	var result struct {
		Subject     string `json:"subject"`
		HtmlContent string `json:"html_content"`
	}
	if err := json.Unmarshal([]byte(chatResp.Choices[0].Message.Content), &result); err != nil {
		// Fallback if AI didn't return perfect JSON or returned markdown block
		// Sometimes AI wraps JSON in ```json ... ```
		content := chatResp.Choices[0].Message.Content
		// Simple stripping of markdown if present
		if len(content) > 7 && content[:7] == "```json" {
			content = content[7 : len(content)-3]
		} else if len(content) > 3 && content[:3] == "```" {
			content = content[3 : len(content)-3]
		}
		if err := json.Unmarshal([]byte(content), &result); err != nil {
			return "AI Draft", chatResp.Choices[0].Message.Content, nil
		}
	}

	return result.Subject, result.HtmlContent, nil
}
