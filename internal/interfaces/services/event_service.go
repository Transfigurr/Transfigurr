<<<<<<<< HEAD:internal/interfaces/services/event_service_interface.go
package services

type EventServiceI interface {
	Log(level, service, message string)
	Startup(logLevel string)
}
========
package services

type EventServiceI interface {
	Log(level, service, message string)
	Startup(logLevel string)
}
>>>>>>>> origin/16-rewrite-backend-in-go:internal/interfaces/services/event_service.go
