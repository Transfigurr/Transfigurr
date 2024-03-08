import logging
import logging.handlers
import queue
import sqlite3
import time


class SQLiteHandler(logging.Handler):
    def __init__(self, db='config/db/database.db'):
        logging.Handler.__init__(self)
        self.db = db
        self.formatter = CustomFormatter("%(asctime)s [%(levelname)s] [%(service)s] %(message)s", datefmt='%Y-%m-%dT%H:%M:%S')

    def emit(self, record):
        conn = None
        try:
            conn = sqlite3.connect(self.db)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    level TEXT,
                    service TEXT,
                    message TEXT
                )
            """)
            conn.execute("""
                CREATE TRIGGER IF NOT EXISTS limit_logs
                AFTER INSERT ON logs
                WHEN (SELECT COUNT(*) FROM logs) > 10000
                BEGIN
                    DELETE FROM logs WHERE id = (SELECT MIN(id) FROM logs);
                END;
            """)
            conn.execute("""
            INSERT INTO logs (timestamp, level, service, message)
                VALUES (?, ?, ?, ?)
                    """, (self.formatter.formatTime(record), record.levelname, getattr(record, 'service', 'undefined'), record.message))
            conn.commit()
            conn.close()
        except sqlite3.Error as e:
            print("An error occurred while logging:", e.args[0])
        finally:
            if conn:
                conn.close()


class CustomFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        ct = self.converter(record.created)
        if datefmt:
            s = time.strftime(datefmt, ct)
            return "%s.%03d" % (s, record.msecs)
        else:
            t = time.strftime(self.default_time_format, ct)
            return "%s.%03d" % (t, record.msecs)


def start_logger(log_level):
    log_queue = queue.Queue(-1)
    queue_handler = logging.handlers.QueueHandler(log_queue)
    sqlite_handler = SQLiteHandler()
    formatter = CustomFormatter("%(asctime)s [%(levelname)s] [%(service)s] %(message)s", datefmt='%Y-%m-%dT%H:%M:%S')
    sqlite_handler.setFormatter(formatter)
    sqlite_handler.formatter = formatter
    logger = logging.getLogger('logger')
    if log_level == 'debug':
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    logger.addHandler(queue_handler)
    queue_listener = logging.handlers.QueueListener(log_queue, sqlite_handler)
    queue_listener.start()
    return logger
