package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
	"transfigurr/internal/interfaces/repositories"
	"transfigurr/internal/models"
	"transfigurr/pkg/jwt"

	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	Repo repositories.SecretsRepositoryI
}

func NewAuthController(repo repositories.SecretsRepositoryI) *AuthController {
	return &AuthController{
		Repo: repo,
	}
}

func (ctrl *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var reqUser models.User
	if err := json.NewDecoder(r.Body).Decode(&reqUser); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	secrets, err := ctrl.Repo.GetSecrets()
	if err != nil {
		http.Error(w, "Failed to retrieve secrets", http.StatusInternalServerError)
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(reqUser.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	secrets.Password = string(hashedPassword)
	secrets.Username = string(reqUser.Username)
	if err := ctrl.Repo.UpdateSecrets(secrets); err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	response := map[string]string{"message": "User registered successfully"}
	json.NewEncoder(w).Encode(response)
}

func (ctrl *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&loginData); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	secrets, err := ctrl.Repo.GetSecrets()
	if err != nil {
		http.Error(w, "Failed to retrieve secrets", http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(secrets.Password), []byte(loginData.Password))
	if err != nil {
		log.Printf("Login failed for user: %s", loginData.Username)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	claims := jwt.Claims{
		"username": loginData.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewToken(claims)
	tokenString, err := token.Sign([]byte(secrets.Secret))
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	response := map[string]string{"token": tokenString}
	json.NewEncoder(w).Encode(response)
}

func (ctrl *AuthController) LoginToken(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")
	secrets, err := ctrl.Repo.GetSecrets()
	if err != nil {
		http.Error(w, "Failed to retrieve secrets", http.StatusInternalServerError)
		return
	}

	token, err := jwt.Parse(tokenString, []byte(secrets.Secret))
	if err != nil {
		http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	username, ok := token.Claims["username"].(string)
	if !ok {
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}

	response := map[string]string{"message": "Welcome " + username}
	json.NewEncoder(w).Encode(response)
}
