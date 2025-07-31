package services

type EventServiceI interface {
	Log(level, service, message string)
	Startup(logLevel string)
}
