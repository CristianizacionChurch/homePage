const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('Cursos - Progress Management', () => {
    const TOTAL_LESSONS = 15;
    const STORAGE_KEY = 'primerosPasos';
    
    function validateProgress(progress) {
        if (!progress || typeof progress !== 'object') {
            return false;
        }
        if (!Array.isArray(progress.completedLessons)) {
            return false;
        }
        for (const lesson of progress.completedLessons) {
            if (typeof lesson !== 'number' || lesson < 1 || lesson > TOTAL_LESSONS) {
                return false;
            }
        }
        return true;
    }
    
    function calculateProgress(completedLessons) {
        if (!Array.isArray(completedLessons)) {
            return 0;
        }
        const validLessons = completedLessons.filter(
            id => typeof id === 'number' && id >= 1 && id <= TOTAL_LESSONS
        );
        const uniqueLessons = [...new Set(validLessons)];
        return Math.round((uniqueLessons.length / TOTAL_LESSONS) * 100);
    }
    
    function validateVideoId(videoId) {
        if (!videoId || typeof videoId !== 'string') {
            return false;
        }
        return /^[a-zA-Z0-9_-]+$/.test(videoId);
    }
    
    function sanitizeInput(str) {
        if (typeof str !== 'string') {
            return '';
        }
        return str.replace(/[<>]/g, '');
    }
    
    describe('validateProgress', () => {
        it('should return true for valid progress object', () => {
            const progress = { completedLessons: [1, 2, 3], lastAccessed: '2026-01-01' };
            assert.strictEqual(validateProgress(progress), true);
        });
        
        it('should return true for empty completedLessons array', () => {
            const progress = { completedLessons: [] };
            assert.strictEqual(validateProgress(progress), true);
        });
        
        it('should return false for null progress', () => {
            assert.strictEqual(validateProgress(null), false);
        });
        
        it('should return false for undefined progress', () => {
            assert.strictEqual(validateProgress(undefined), false);
        });
        
        it('should return false for non-object progress', () => {
            assert.strictEqual(validateProgress('invalid'), false);
            assert.strictEqual(validateProgress(123), false);
        });
        
        it('should return false if completedLessons is not an array', () => {
            const progress = { completedLessons: 'not an array' };
            assert.strictEqual(validateProgress(progress), false);
        });
        
        it('should return false if lesson ID is out of range', () => {
            const progress = { completedLessons: [0, 1, 2] };
            assert.strictEqual(validateProgress(progress), false);
            
            const progress2 = { completedLessons: [1, 2, 16] };
            assert.strictEqual(validateProgress(progress2), false);
        });
        
        it('should return false if lesson ID is not a number', () => {
            const progress = { completedLessons: [1, '2', 3] };
            assert.strictEqual(validateProgress(progress), false);
        });
    });
    
    describe('calculateProgress', () => {
        it('should return 0 for empty array', () => {
            assert.strictEqual(calculateProgress([]), 0);
        });
        
        it('should return correct percentage for partial completion', () => {
            assert.strictEqual(calculateProgress([1, 2, 3]), 20);
            assert.strictEqual(calculateProgress([1, 2, 3, 4, 5, 6]), 40);
            assert.strictEqual(calculateProgress([1, 2, 3, 4, 5, 6, 7, 8, 9]), 60);
        });
        
        it('should return 100 for all lessons completed', () => {
            const allLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            assert.strictEqual(calculateProgress(allLessons), 100);
        });
        
        it('should handle duplicate lesson IDs', () => {
            assert.strictEqual(calculateProgress([1, 1, 1, 2, 2, 3]), 20);
        });
        
        it('should ignore invalid lesson IDs', () => {
            assert.strictEqual(calculateProgress([0, 1, 2, 16, 17]), 13);
        });
        
        it('should return 0 for non-array input', () => {
            assert.strictEqual(calculateProgress(null), 0);
            assert.strictEqual(calculateProgress(undefined), 0);
            assert.strictEqual(calculateProgress('invalid'), 0);
        });
    });
    
    describe('validateVideoId', () => {
        it('should return true for valid YouTube video IDs', () => {
            assert.strictEqual(validateVideoId('dQw4w9WgXcQ'), true);
            assert.strictEqual(validateVideoId('abc123_-XYZ'), true);
            assert.strictEqual(validateVideoId('Fpjdc32GMf4'), true);
        });
        
        it('should return false for invalid video IDs', () => {
            assert.strictEqual(validateVideoId(''), false);
            assert.strictEqual(validateVideoId(null), false);
            assert.strictEqual(validateVideoId(undefined), false);
            assert.strictEqual(validateVideoId(123), false);
        });
        
        it('should return false for video IDs with special characters', () => {
            assert.strictEqual(validateVideoId('abc<script>'), false);
            assert.strictEqual(validateVideoId('abc def'), false);
            assert.strictEqual(validateVideoId('abc/def'), false);
        });
    });
    
    describe('sanitizeInput', () => {
        it('should remove HTML tags', () => {
            assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script');
            assert.strictEqual(sanitizeInput('<b>bold</b>'), 'bbold/b');
        });
        
        it('should return empty string for non-string input', () => {
            assert.strictEqual(sanitizeInput(null), '');
            assert.strictEqual(sanitizeInput(undefined), '');
            assert.strictEqual(sanitizeInput(123), '');
        });
        
        it('should preserve valid text', () => {
            assert.strictEqual(sanitizeInput('Hello World'), 'Hello World');
            assert.strictEqual(sanitizeInput('Test 123'), 'Test 123');
        });
    });
});

describe('Cursos - Lesson Card States', () => {
    function toggleLessonState(completedLessons, lessonId) {
        if (!Array.isArray(completedLessons)) {
            completedLessons = [];
        }
        
        const index = completedLessons.indexOf(lessonId);
        const newLessons = [...completedLessons];
        
        if (index === -1) {
            newLessons.push(lessonId);
        } else {
            newLessons.splice(index, 1);
        }
        
        return newLessons;
    }
    
    describe('toggleLessonState', () => {
        it('should add lesson to completed list', () => {
            const result = toggleLessonState([], 1);
            assert.deepStrictEqual(result, [1]);
        });
        
        it('should remove lesson from completed list', () => {
            const result = toggleLessonState([1, 2, 3], 2);
            assert.deepStrictEqual(result, [1, 3]);
        });
        
        it('should handle toggling same lesson twice', () => {
            let result = toggleLessonState([], 1);
            assert.deepStrictEqual(result, [1]);
            
            result = toggleLessonState(result, 1);
            assert.deepStrictEqual(result, []);
        });
        
        it('should handle invalid input gracefully', () => {
            const result = toggleLessonState(null, 1);
            assert.deepStrictEqual(result, [1]);
            
            const result2 = toggleLessonState(undefined, 1);
            assert.deepStrictEqual(result2, [1]);
        });
    });
});

describe('Cursos - Completion Detection', () => {
    const TOTAL_LESSONS = 15;
    
    function isCourseCompleted(completedLessons) {
        if (!Array.isArray(completedLessons)) {
            return false;
        }
        const uniqueLessons = new Set(completedLessons);
        return uniqueLessons.size >= TOTAL_LESSONS;
    }
    
    describe('isCourseCompleted', () => {
        it('should return false for empty array', () => {
            assert.strictEqual(isCourseCompleted([]), false);
        });
        
        it('should return false for partial completion', () => {
            assert.strictEqual(isCourseCompleted([1, 2, 3, 4, 5]), false);
        });
        
        it('should return true for all lessons completed', () => {
            const allLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            assert.strictEqual(isCourseCompleted(allLessons), true);
        });
        
        it('should handle duplicates correctly', () => {
            const withDuplicates = [1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            assert.strictEqual(isCourseCompleted(withDuplicates), true);
        });
        
        it('should return false for invalid input', () => {
            assert.strictEqual(isCourseCompleted(null), false);
            assert.strictEqual(isCourseCompleted(undefined), false);
        });
    });
});
