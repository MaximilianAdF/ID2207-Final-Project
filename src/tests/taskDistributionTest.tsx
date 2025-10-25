// Task Distribution Model Tests
// Tests for Task Allocation and Planning user stories

import {
  TaskDistribution,
  TaskDistributionStatus,
  SubTeamTask,
  createTaskDistribution,
  getTaskDistributionById,
  getAllTaskDistributions,
  forwardTaskToSubTeam,
  submitSubTeamFeedback,
  reviewSubTeamFeedback,
  getTaskDistributionsForUser,
  clearTaskDistributions,
} from '../model/taskDistributionModel';

// Helper function to create sample task distribution data
function createSampleTaskData() {
  return {
    eventRequestId: 'EVT-001',
    title: 'Wedding Event - December 2024',
    description: 'Complete wedding event with 50 guests',
    totalBudget: 5000,
    eventDate: '2024-12-15',
    tasks: [
      {
        id: 'TASK-001',
        subTeam: 'Decorations',
        assignedTo: ['John Doe', 'Jane Smith'],
        requirements: 'Floral arrangements, table decorations',
        allocatedBudget: 1000,
        deadline: '2024-12-10',
        status: 'PENDING',
      },
      {
        id: 'TASK-002',
        subTeam: 'Catering',
        assignedTo: ['Chef Mike', 'Server Sarah'],
        requirements: 'Dinner for 50, vegetarian options',
        allocatedBudget: 2500,
        deadline: '2024-12-14',
        status: 'PENDING',
      },
    ],
  };
}

beforeEach(() => {
  clearTaskDistributions();
});

// Create Task Distribution Form tests
test('should create task distribution with correct initial status', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  
  expect(distribution).not.toBeNull();
  expect(distribution.id).toBeDefined();
  expect(distribution.status).toBe(TaskDistributionStatus.DRAFT);
  expect(distribution.createdBy).toBe('PM');
  expect(distribution.totalBudget).toBe(5000);
  expect(distribution.tasks).toHaveLength(2);
});

test('should create task distribution with multiple sub-team assignments', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'SM');
  
  expect(distribution.tasks[0].subTeam).toBe('Decorations');
  expect(distribution.tasks[1].subTeam).toBe('Catering');
  expect(distribution.tasks[0].assignedTo).toHaveLength(2);
});

test('should retrieve task distribution by ID', () => {
  const data = createSampleTaskData();
  const created = createTaskDistribution(data, 'PM');
  
  const retrieved = getTaskDistributionById(created.id);
  
  expect(retrieved).not.toBeNull();
  expect(retrieved?.id).toBe(created.id);
  expect(retrieved?.title).toBe(created.title);
});

test('should return null for non-existent task distribution ID', () => {
  const retrieved = getTaskDistributionById('NON-EXISTENT');
  
  expect(retrieved).toBeNull();
});

// Forward Task Distribution Form tests
test('should forward task distribution to sub-teams', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  
  const forwarded = forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  expect(forwarded).not.toBeNull();
  expect(forwarded?.tasks[0].status).toBe('ASSIGNED');
});

test('should not forward already assigned task', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  const secondForward = forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  expect(secondForward).toBeNull();
});

test('should forward multiple tasks independently', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-002', 'PM');
  
  const updated = getTaskDistributionById(distribution.id);
  
  expect(updated?.tasks[0].status).toBe('ASSIGNED');
  expect(updated?.tasks[1].status).toBe('ASSIGNED');
});

// Review Task Distribution Form tests
test('should submit sub-team feedback with comments', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  const feedback = {
    comments: 'Need more time for setup',
    suggestions: 'Additional staff required',
    budgetIncrease: 200,
  };
  
  const updated = submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'John Doe');
  
  expect(updated).not.toBeNull();
  expect(updated?.tasks[0].feedback).toBeDefined();
  expect(updated?.tasks[0].feedback?.comments).toBe('Need more time for setup');
  expect(updated?.tasks[0].status).toBe('FEEDBACK_SUBMITTED');
});

test('should handle budget increase request in feedback', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  const feedback = {
    comments: 'Materials cost more than expected',
    suggestions: 'Use premium materials',
    budgetIncrease: 500,
  };
  
  const updated = submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'Jane Smith');
  
  expect(updated?.tasks[0].feedback?.budgetIncrease).toBe(500);
  expect(updated?.tasks[0].allocatedBudget).toBe(1000); // Original budget unchanged
});

test('should not allow feedback on non-assigned tasks', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  
  const feedback = {
    comments: 'Some feedback',
    suggestions: 'Some suggestions',
  };
  
  const result = submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'John Doe');
  
  expect(result).toBeNull();
});

// Review Task Distribution Form & Plan tests
test('should review sub-team feedback and approve', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  const feedback = {
    comments: 'All good',
    suggestions: 'None',
  };
  submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'John Doe');
  
  const reviewed = reviewSubTeamFeedback(distribution.id, 'TASK-001', 'APPROVED', 'PM');
  
  expect(reviewed).not.toBeNull();
  expect(reviewed?.tasks[0].status).toBe('APPROVED');
});

test('should review sub-team feedback and request revision', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  const feedback = {
    comments: 'Need changes',
    suggestions: 'Different approach',
  };
  submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'John Doe');
  
  const reviewed = reviewSubTeamFeedback(distribution.id, 'TASK-001', 'NEEDS_REVISION', 'PM');
  
  expect(reviewed?.tasks[0].status).toBe('NEEDS_REVISION');
});

test('should approve budget increase request', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  const feedback = {
    comments: 'Need more budget',
    suggestions: 'Better quality materials',
    budgetIncrease: 300,
  };
  submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'John Doe');
  
  const reviewed = reviewSubTeamFeedback(
    distribution.id, 
    'TASK-001', 
    'APPROVED', 
    'PM',
    true // approve budget increase
  );
  
  expect(reviewed?.tasks[0].allocatedBudget).toBe(1300); // 1000 + 300
});

test('should get task distributions for Production Manager', () => {
  const data1 = createSampleTaskData();
  const data2 = { ...createSampleTaskData(), title: 'Corporate Event' };
  
  createTaskDistribution(data1, 'PM');
  createTaskDistribution(data2, 'PM');
  
  const pmDistributions = getTaskDistributionsForUser('PM');
  
  expect(pmDistributions).toHaveLength(2);
});

test('should get task distributions for sub-team member', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  
  const memberDistributions = getTaskDistributionsForUser('John Doe');
  
  expect(memberDistributions).toHaveLength(1);
  expect(memberDistributions[0].tasks.some(t => t.assignedTo.includes('John Doe'))).toBe(true);
});

test('should handle complete task distribution workflow', () => {
  const data = createSampleTaskData();
  
  // 1. PM creates task distribution
  const distribution = createTaskDistribution(data, 'PM');
  expect(distribution.status).toBe(TaskDistributionStatus.DRAFT);
  
  // 2. PM forwards task to sub-team
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  let updated = getTaskDistributionById(distribution.id);
  expect(updated?.tasks[0].status).toBe('ASSIGNED');
  
  // 3. Sub-team submits feedback
  const feedback = {
    comments: 'Ready to proceed',
    suggestions: 'All looks good',
  };
  submitSubTeamFeedback(distribution.id, 'TASK-001', feedback, 'John Doe');
  updated = getTaskDistributionById(distribution.id);
  expect(updated?.tasks[0].status).toBe('FEEDBACK_SUBMITTED');
  
  // 4. PM reviews and approves
  reviewSubTeamFeedback(distribution.id, 'TASK-001', 'APPROVED', 'PM');
  updated = getTaskDistributionById(distribution.id);
  expect(updated?.tasks[0].status).toBe('APPROVED');
});

test('should track all task statuses within distribution', () => {
  const data = createSampleTaskData();
  const distribution = createTaskDistribution(data, 'PM');
  
  forwardTaskToSubTeam(distribution.id, 'TASK-001', 'PM');
  forwardTaskToSubTeam(distribution.id, 'TASK-002', 'PM');
  
  submitSubTeamFeedback(distribution.id, 'TASK-001', 
    { comments: 'Done', suggestions: 'None' }, 'John Doe');
  
  const updated = getTaskDistributionById(distribution.id);
  
  expect(updated?.tasks[0].status).toBe('FEEDBACK_SUBMITTED');
  expect(updated?.tasks[1].status).toBe('ASSIGNED');
});
