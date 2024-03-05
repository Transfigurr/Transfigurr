import logging
import logging.handlers
import queue
import sqlite3


class SQLiteHandler(logging.Handler):
    def __init__(self, db='config/db/database.db'):
        logging.Handler.__init__(self)
        self.db = db
        self.formatter = logging.Formatter()

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


def start_logger(log_level):
    log_queue = queue.Queue(-1)
    queue_handler = logging.handlers.QueueHandler(log_queue)
    sqlite_handler = SQLiteHandler()
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] [%(service)s] %(message)s")
    sqlite_handler.setFormatter(formatter)
    logger = logging.getLogger('logger')
    if log_level == 'debug':
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    logger.addHandler(queue_handler)
    queue_listener = logging.handlers.QueueListener(log_queue, sqlite_handler)
    queue_listener.start()
    return logger
