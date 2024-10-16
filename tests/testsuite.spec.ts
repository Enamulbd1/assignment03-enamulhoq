import { test, expect } from '@playwright/test';


test.describe('testsuite 01- Front-end tests', () => {
  test('Test case 01 . login & logout', async ({ page }) => {
    // perform login
    await page.goto(`${process.env.BASE_URL}`);
    await expect(page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible(); //assertion
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();


    // perform logout
   await page.getByRole('button', { name: '' }).click();
   await page.waitForURL('http://localhost:3000/login');
   await expect(page.url()).toBe('http://localhost:3000/login'); //assertion
   await expect(page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible(); //assertion
  });

  test('Test case 02- create room', async ({ page }) => {
    // perform login
    await page.goto(`${process.env.BASE_URL}`);
    await expect(page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible(); //assertion
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();


    // perform create client
    await page.locator('#app > div > div > div:nth-child(2) > a').click();
    await expect(page.getByRole('link', { name: 'Create Client' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: 'Create Client' }).click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').fill('saifan');
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('saifan@gmail.com');
    await page.locator('div').filter({ hasText: /^Telephone$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Telephone$/ }).getByRole('textbox').fill('0763908045');
    await page.getByText('Save').click();
    await page.waitForURL('http://localhost:3000/clients');
    await expect(page.url()).toBe('http://localhost:3000/clients'); //assertion
    await expect(page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible(); //assertion 
  });
});

test.describe('testsuite 02- Back-end tests', () => {
  test('test case 01 - login', async ({ request }) => {
    // Sending login request
    const response = await request.post('http://localhost:3000/api/login', {
      data: {
        "username": `${process.env.TEST_USERNAME}`,  // Username from environment variable
        "password": `${process.env.TEST_PASSWORD}`   // Password from environment variable
      }
    });
    
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    const authToken = responseBody.token; // Change 'token' to match the key in your response
    console.log(`Authentication token: ${authToken}`);
    expect(authToken).toBeTruthy();  // Ensure the token is present
  });

  test.describe('testsuite 02- Back-end tests', () => {

    test('test case 02- get all the clients', async ({ request }) => {
      
      // Step 1: Login and retrieve auth token
      const loginResponse = await request.post('http://localhost:3000/api/login', {
        data: {
          "username": `${process.env.TEST_USERNAME}`,
          "password": `${process.env.TEST_PASSWORD}` 
        }
      });
      expect(loginResponse.ok()).toBeTruthy();
      const responseBody = await loginResponse.json();
      const authToken = responseBody.token;  // Assuming the token is in the responseBody.token
  
      console.log(`Authentication token: ${authToken}`);
      const getClientsResponse = await request.get('http://localhost:3000/api/clients', {
        headers: {
          "content-type": "application/json",
          'x-user-auth': `{"username":"tester01","token":"${authToken}"}`
        }
      });
      expect(getClientsResponse.ok()).toBeTruthy();
 
    });
  
  });
  
});


