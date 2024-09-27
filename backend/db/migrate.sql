CREATE TABLE IF NOT EXISTS documents (
    title TEXT,
    content TEXT,
    created_at DATE DEFAULT (datetime('now','localtime'))
);


INSERT INTO documents (title, content) VALUES
('Introduction to SQL', 'SQL (Structured Query Language) is a standard language for managing and manipulating relational databases...'),
('Python Basics', 'Python is a high-level, interpreted programming language known for its simplicity and readability...'),
('Web Development Fundamentals', 'Web development involves creating and maintaining websites and web applications...'),
('Data Science Overview', 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data...'),
('Machine Learning Concepts', 'Machine learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience...');