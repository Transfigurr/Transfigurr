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
        try:
            conn = sqlite3.connect(self.db)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    level TEXT,
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
            conn.execute("INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)",
                         (self.formatter.formatTime(record), record.levelname, record.message))
            conn.commit()
            conn.close()
        except sqlite3.Error as e:
            print("An error occurred while logging:", e.args[0])
        finally:
            if conn:
                conn.close()


def setup_logger():
    log_queue = queue.Queue(-1)  # Infinite size
    queue_handler = logging.handlers.QueueHandler(log_queue)
    sqlite_handler = SQLiteHandler()
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    sqlite_handler.setFormatter(formatter)
    logger = logging.getLogger('logger')
    logger.setLevel(logging.DEBUG)
    logger.addHandler(queue_handler)
    queue_listener = logging.handlers.QueueListener(log_queue, sqlite_handler)
    queue_listener.start()
