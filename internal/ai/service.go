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

func (s *Service) GenerateEmailContent(goal, painPoint string) (string, string, error) {
	if s.apiKey == "" {
		return "", "", fmt.Errorf("OpenAI API key not configured")
	}

	prompt := fmt.Sprintf("Draft a professional marketing email for the following goal: %s.\nCritically address this target pain point in the pitch: %s\nReturn a JSON object with 'subject' and 'html_content' keys. Ensure the content is engaging and use full HTML formatting.", goal, painPoint)

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

func (s *Service) GeneratePersonalizedDraft(domain, goal string) (string, error) {
	if s.apiKey == "" {
		return "", fmt.Errorf("OpenAI API key not set")
	}

	prompt := fmt.Sprintf(`Draft a highly personalized short email for a contact at the company: %s.
Goal of the email: %s
Research notes: Assume the company is a leader in their field. Mention how our service can help them specifically based on their industry.
Tone: Professional, friendly, and concise. 
Format: Return ONLY the email body.`, domain, goal)

	messages := []Message{
		{Role: "system", Content: "You are an expert sales and marketing assistant. You research companies and write tailored outreach emails."},
		{Role: "user", Content: prompt},
	}

	reqBody := struct {
		Model    string    `json:"model"`
		Messages []Message `json:"messages"`
	}{
		Model:    "gpt-4o",
		Messages: messages,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("OpenAI API error: %d", resp.StatusCode)
	}

	var res struct {
		Choices []struct {
			Message Message `json:"message"`
		} `json:"choices"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", err
	}

	if len(res.Choices) > 0 {
		return res.Choices[0].Message.Content, nil
	}

	return "", fmt.Errorf("no content generated")
}
