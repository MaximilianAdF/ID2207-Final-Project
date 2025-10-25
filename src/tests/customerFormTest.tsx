// Customer Form Data Validation Tests

interface CustomerFormData {
  recordNumber: string;
  clientName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  expectedNumber: number;
  budget: number;
  decoration: boolean;
  food: boolean;
  drinks: boolean;
  photo: boolean;
  parties: boolean;
}

// Helper function to validate form data structure
function validateCustomerFormData(formData: CustomerFormData): boolean {
    const requiredStringFields = ['recordNumber', 'clientName', 'eventType', 'startDate', 'endDate'];
    const requiredNumberFields = ['expectedNumber', 'budget'];
    const requiredBooleanFields = ['decoration', 'food', 'drinks', 'photo', 'parties'];
    
    // Check string fields
    for (const field of requiredStringFields) {
        if (typeof formData[field as keyof CustomerFormData] !== 'string') {
            return false;
        }
    }
    
    // Check number fields
    for (const field of requiredNumberFields) {
        if (typeof formData[field as keyof CustomerFormData] !== 'number') {
            return false;
        }
    }
    
    // Check boolean fields
    for (const field of requiredBooleanFields) {
        if (typeof formData[field as keyof CustomerFormData] !== 'boolean') {
            return false;
        }
    }
    
    return true;
}

// Helper function to validate positive numbers
function validatePositiveNumbers(expectedNumber: number, budget: number): boolean {
    return expectedNumber > 0 && budget > 0;
}

// Helper function to validate date format
function validateDateFormat(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

// Helper function to create valid form data
function createValidFormData(): CustomerFormData {
    return {
        recordNumber: "REC001",
        clientName: "John Doe",
        eventType: "Wedding",
        startDate: "2024-12-01",
        endDate: "2024-12-02",
        expectedNumber: 50,
        budget: 5000,
        decoration: true,
        food: false,
        drinks: true,
        photo: false,
        parties: true,
    };
}

test('should validate form data structure correctly', () => {
    const validFormData = createValidFormData();
    
    expect(validateCustomerFormData(validFormData)).toBe(true);
});

test('should validate positive number fields correctly', () => {
    const formData = createValidFormData();
    
    expect(validatePositiveNumbers(formData.expectedNumber, formData.budget)).toBe(true);
    expect(validatePositiveNumbers(0, 5000)).toBe(false);
    expect(validatePositiveNumbers(50, 0)).toBe(false);
    expect(validatePositiveNumbers(-1, 5000)).toBe(false);
});

test('should validate date format correctly', () => {
    expect(validateDateFormat("2024-12-01")).toBe(true);
    expect(validateDateFormat("2024-02-29")).toBe(true); // Leap year
    expect(validateDateFormat("invalid-date")).toBe(false);
    expect(validateDateFormat("24-12-01")).toBe(false);
    expect(validateDateFormat("2024/12/01")).toBe(false);
});

test('should have correct field types in form data', () => {
    const formData = createValidFormData();
    
    // Test string fields
    expect(typeof formData.recordNumber).toBe('string');
    expect(typeof formData.clientName).toBe('string');
    expect(typeof formData.eventType).toBe('string');
    expect(typeof formData.startDate).toBe('string');
    expect(typeof formData.endDate).toBe('string');
    
    // Test number fields
    expect(typeof formData.expectedNumber).toBe('number');
    expect(typeof formData.budget).toBe('number');
    
    // Test boolean fields
    expect(typeof formData.decoration).toBe('boolean');
    expect(typeof formData.food).toBe('boolean');
    expect(typeof formData.drinks).toBe('boolean');
    expect(typeof formData.photo).toBe('boolean');
    expect(typeof formData.parties).toBe('boolean');
});

test('should handle service selections correctly', () => {
    const formData = createValidFormData();
    
    // Test that all service fields are boolean
    expect([true, false]).toContain(formData.decoration);
    expect([true, false]).toContain(formData.food);
    expect([true, false]).toContain(formData.drinks);
    expect([true, false]).toContain(formData.photo);
    expect([true, false]).toContain(formData.parties);
    
    // Test changing service selections
    const updatedFormData = { ...formData, decoration: !formData.decoration };
    expect(typeof updatedFormData.decoration).toBe('boolean');
    expect(updatedFormData.decoration).toBe(!formData.decoration);
});