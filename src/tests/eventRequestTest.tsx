// Event Request Model Tests

import {
  EventRequest,
  EventRequestStatus,
  createEventRequest,
  getEventRequestById,
  getAllEventRequests,
  getEventRequestsByStatus,
  forwardToSeniorCS,
  updateEventRequestStatus,
  submitFinancialReview,
  submitAdministrationReview,
  getEventRequestsForUser,
  clearEventRequests,
} from '../model/eventRequestModel';

// Helper function to create sample event request data
function createSampleEventRequestData() {
  return {
    recordNumber: "REC001",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "+1234567890",
    eventType: "Wedding",
    startDate: "2024-12-01",
    endDate: "2024-12-02",
    expectedNumber: 50,
    budget: 5000,
    preferences: {
      decoration: true,
      food: true,
      drinks: true,
      photo: false,
      parties: false,
    },
  };
}

// Clear data before each test
beforeEach(() => {
  clearEventRequests();
});

test('should create a new event request with correct initial status', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  
  expect(request).not.toBeNull();
  expect(request.id).toBeDefined();
  expect(request.status).toBe(EventRequestStatus.DRAFT);
  expect(request.createdBy).toBe('CS');
  expect(request.clientName).toBe('John Doe');
});

test('should retrieve event request by ID', () => {
  const data = createSampleEventRequestData();
  const created = createEventRequest(data, 'CS');
  
  const retrieved = getEventRequestById(created.id);
  
  expect(retrieved).not.toBeNull();
  expect(retrieved?.id).toBe(created.id);
  expect(retrieved?.clientName).toBe('John Doe');
});

test('should return null for non-existent event request ID', () => {
  const retrieved = getEventRequestById('NON-EXISTENT-ID');
  
  expect(retrieved).toBeNull();
});

test('should get all event requests', () => {
  const data1 = createSampleEventRequestData();
  const data2 = { ...createSampleEventRequestData(), clientName: 'Jane Smith' };
  
  createEventRequest(data1, 'CS');
  createEventRequest(data2, 'CS');
  
  const allRequests = getAllEventRequests();
  
  expect(allRequests).toHaveLength(2);
});

test('should get event requests by status', () => {
  const data1 = createSampleEventRequestData();
  const data2 = createSampleEventRequestData();
  
  const req1 = createEventRequest(data1, 'CS');
  createEventRequest(data2, 'CS');
  
  // Forward one request
  forwardToSeniorCS(req1.id, 'CS');
  
  const draftRequests = getEventRequestsByStatus(EventRequestStatus.DRAFT);
  const pendingRequests = getEventRequestsByStatus(EventRequestStatus.PENDING_SCS_REVIEW);
  
  expect(draftRequests).toHaveLength(1);
  expect(pendingRequests).toHaveLength(1);
});

test('should forward event request to Senior CS', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  
  const forwarded = forwardToSeniorCS(request.id, 'CS');
  
  expect(forwarded).not.toBeNull();
  expect(forwarded?.status).toBe(EventRequestStatus.PENDING_SCS_REVIEW);
});

test('should not forward already forwarded request', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  
  forwardToSeniorCS(request.id, 'CS');
  const secondForward = forwardToSeniorCS(request.id, 'CS');
  
  expect(secondForward).toBeNull();
});

test('should update event request status by Senior CS', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  forwardToSeniorCS(request.id, 'CS');
  
  const updated = updateEventRequestStatus(
    request.id,
    EventRequestStatus.PENDING_FINANCIAL_REVIEW,
    'SCS'
  );
  
  expect(updated).not.toBeNull();
  expect(updated?.status).toBe(EventRequestStatus.PENDING_FINANCIAL_REVIEW);
});

test('should submit Financial Manager review with approval', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  forwardToSeniorCS(request.id, 'CS');
  updateEventRequestStatus(request.id, EventRequestStatus.PENDING_FINANCIAL_REVIEW, 'SCS');
  
  const reviewed = submitFinancialReview(
    request.id,
    {
      reviewedBy: 'FM',
      comments: 'Budget looks good',
      recommendation: 'APPROVE',
      budgetComments: 'Approved within budget',
    },
    'FM'
  );
  
  expect(reviewed).not.toBeNull();
  expect(reviewed?.financialReview).toBeDefined();
  expect(reviewed?.financialReview?.recommendation).toBe('APPROVE');
  expect(reviewed?.status).toBe(EventRequestStatus.PENDING_ADMINISTRATION_REVIEW);
});

test('should submit Financial Manager review with rejection', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  forwardToSeniorCS(request.id, 'CS');
  updateEventRequestStatus(request.id, EventRequestStatus.PENDING_FINANCIAL_REVIEW, 'SCS');
  
  const reviewed = submitFinancialReview(
    request.id,
    {
      reviewedBy: 'FM',
      comments: 'Budget exceeds limits',
      recommendation: 'REJECT',
    },
    'FM'
  );
  
  expect(reviewed).not.toBeNull();
  expect(reviewed?.status).toBe(EventRequestStatus.REJECTED);
  expect(reviewed?.rejectionReason).toBe('Budget exceeds limits');
});

test('should submit Administration Manager review with approval', () => {
  const data = createSampleEventRequestData();
  const request = createEventRequest(data, 'CS');
  forwardToSeniorCS(request.id, 'CS');
  updateEventRequestStatus(request.id, EventRequestStatus.PENDING_FINANCIAL_REVIEW, 'SCS');
  submitFinancialReview(
    request.id,
    { reviewedBy: 'FM', comments: 'Approved', recommendation: 'APPROVE' },
    'FM'
  );
  
  const reviewed = submitAdministrationReview(
    request.id,
    {
      reviewedBy: 'AM',
      comments: 'Event is feasible',
      recommendation: 'APPROVE',
    },
    'AM'
  );
  
  expect(reviewed).not.toBeNull();
  expect(reviewed?.administrationReview).toBeDefined();
  expect(reviewed?.status).toBe(EventRequestStatus.APPROVED);
});

test('should get event requests for CS user', () => {
  const data = createSampleEventRequestData();
  createEventRequest(data, 'CS');
  createEventRequest(data, 'CS');
  
  const csRequests = getEventRequestsForUser('CS');
  
  expect(csRequests).toHaveLength(2);
});

test('should get event requests for SCS user', () => {
  const data = createSampleEventRequestData();
  const req = createEventRequest(data, 'CS');
  forwardToSeniorCS(req.id, 'CS');
  
  const scsRequests = getEventRequestsForUser('SCS');
  
  expect(scsRequests).toHaveLength(1);
  expect(scsRequests[0].status).toBe(EventRequestStatus.PENDING_SCS_REVIEW);
});

test('should get event requests for FM user', () => {
  const data = createSampleEventRequestData();
  const req = createEventRequest(data, 'CS');
  forwardToSeniorCS(req.id, 'CS');
  updateEventRequestStatus(req.id, EventRequestStatus.PENDING_FINANCIAL_REVIEW, 'SCS');
  
  const fmRequests = getEventRequestsForUser('FM');
  
  expect(fmRequests).toHaveLength(1);
  expect(fmRequests[0].status).toBe(EventRequestStatus.PENDING_FINANCIAL_REVIEW);
});

test('should get event requests for AM user', () => {
  const data = createSampleEventRequestData();
  const req = createEventRequest(data, 'CS');
  forwardToSeniorCS(req.id, 'CS');
  updateEventRequestStatus(req.id, EventRequestStatus.PENDING_FINANCIAL_REVIEW, 'SCS');
  submitFinancialReview(
    req.id,
    { reviewedBy: 'FM', comments: 'Approved', recommendation: 'APPROVE' },
    'FM'
  );
  
  const amRequests = getEventRequestsForUser('AM');
  
  expect(amRequests).toHaveLength(1);
  expect(amRequests[0].status).toBe(EventRequestStatus.PENDING_ADMINISTRATION_REVIEW);
});

test('should handle complete workflow from creation to approval', () => {
  const data = createSampleEventRequestData();
  
  // 1. CS creates request
  const request = createEventRequest(data, 'CS');
  expect(request.status).toBe(EventRequestStatus.DRAFT);
  
  // 2. CS forwards to Senior CS
  forwardToSeniorCS(request.id, 'CS');
  const afterForward = getEventRequestById(request.id);
  expect(afterForward?.status).toBe(EventRequestStatus.PENDING_SCS_REVIEW);
  
  // 3. Senior CS sends to Financial Manager
  updateEventRequestStatus(request.id, EventRequestStatus.PENDING_FINANCIAL_REVIEW, 'SCS');
  const afterSCS = getEventRequestById(request.id);
  expect(afterSCS?.status).toBe(EventRequestStatus.PENDING_FINANCIAL_REVIEW);
  
  // 4. FM approves
  submitFinancialReview(
    request.id,
    { reviewedBy: 'FM', comments: 'Approved', recommendation: 'APPROVE' },
    'FM'
  );
  const afterFM = getEventRequestById(request.id);
  expect(afterFM?.status).toBe(EventRequestStatus.PENDING_ADMINISTRATION_REVIEW);
  
  // 5. AM approves
  submitAdministrationReview(
    request.id,
    { reviewedBy: 'AM', comments: 'Final approval', recommendation: 'APPROVE' },
    'AM'
  );
  const final = getEventRequestById(request.id);
  expect(final?.status).toBe(EventRequestStatus.APPROVED);
  expect(final?.financialReview).toBeDefined();
  expect(final?.administrationReview).toBeDefined();
});
