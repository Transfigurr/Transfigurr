package middleware

import (
	"net/http"
	"sync"

	"golang.org/x/time/rate"
)

type RateLimitConfig struct {
	RequestsPerSecond rate.Limit
	Burst             int
}

var (
	DefaultConfig = RateLimitConfig{
		RequestsPerSecond: 10,
		Burst:             20,
	}

	PublicConfig = RateLimitConfig{
		RequestsPerSecond: 30,
		Burst:             50,
	}
)

type ClientRateLimiter struct {
	limiters map[string]*rate.Limiter
	config   RateLimitConfig
	mu       sync.Mutex
}

func NewClientRateLimiter(config RateLimitConfig) *ClientRateLimiter {
	return &ClientRateLimiter{
		limiters: make(map[string]*rate.Limiter),
		config:   config,
	}
}

func (c *ClientRateLimiter) GetLimiter(ip string) *rate.Limiter {
	c.mu.Lock()
	defer c.mu.Unlock()

	limiter, exists := c.limiters[ip]
	if !exists {
		limiter = rate.NewLimiter(c.config.RequestsPerSecond, c.config.Burst)
		c.limiters[ip] = limiter
	}
	return limiter
}

func RateLimit(config RateLimitConfig) func(http.Handler) http.Handler {
	limiter := NewClientRateLimiter(config)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := r.RemoteAddr
			if !limiter.GetLimiter(ip).Allow() {
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
