import { authenticateUser, users } from '../model/userModel';


test('should return a user object for valid credentials', () => {
      const testUser = users[0]; 

      const result = authenticateUser(testUser.username, testUser.password);

      expect(result).not.toBeNull(); 
      expect(result).toMatchObject(testUser);
});

test('should return null for a valid username but invalid password', () => {
      const result = authenticateUser('CS', 'WrongPassword');
      
      expect(result).toBeNull();
});


test('should return null for an invalid username', () => {
    const result = authenticateUser('Does\'nt exist', 'Pass');
    
    expect(result).toBeNull();
})

