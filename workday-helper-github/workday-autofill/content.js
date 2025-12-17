// Workday Auto-Fill Extension
console.log('Workday Helper Active');

// Default info (will be overridden by storage)
let USER_INFO = {
  // Account
  email: "your.email@example.com",
  password: "YourPassword123!",
  
  // Personal
  firstName: "John",
  lastName: "Doe",
  
  // Address
  address: "123 Main Street Apt 1",
  city: "Your City",
  state: "Your State",
  postalCode: "12345",
  country: "United States of America",
  
  // Phone
  phone: "(555) 123-4567",
  phoneType: "Mobile",
  
  // Common Questions
  howDidYouHear: "LinkedIn",
  previousEmployee: "No",
  needSponsorship: "No",
  authorizedToWork: "Yes",
  willingToRelocate: "Yes",
  availability: "Immediate",
  
  // Application Questions
  visaSponsorship: "No",
  salaryRange: "$40,000 - $60,000",
  education: "Bachelor's Degree",
  portfolio: "",
  
  // Demographics (EEO)
  race: "Prefer not to say",
  gender: "Prefer not to say",
  veteran: "No",
  disability: "No",
  
  // Work Experience
  workExperiences: [
    {
      jobTitle: "Your Job Title",
      company: "Company Name",
      location: "City, State",
      currentlyWorking: true,
      startMonth: "01",
      startYear: "2024",
      endMonth: "",
      endYear: "",
      description: "Describe your job responsibilities and achievements here."
    }
  ],
  
  // Education
  school: "Your University",
  degree: "Bachelor's Degree",
  fieldOfStudy: "Your Major",
  gpa: "3.5",
  startYear: "2020",
  endYear: "2024",
  expectedGraduation: "05/2024",
  
  // Skills
  skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  
  // Social Media
  linkedin: "",
  twitter: "",
  facebook: "",
  
  // Essay Questions (common ones)
  whyJoinUs: "I am passionate about this field and believe this opportunity will provide valuable hands-on experience. I'm eager to contribute my skills while learning from industry professionals.",
  
  whyThisCompany: "Your company's commitment to innovation and excellence aligns perfectly with my career goals. I'm particularly interested in your recent projects and would love to contribute to your team's success.",
  
  careerGoals: "I aim to develop my technical and professional skills while gaining practical experience in this industry. This position represents an important step toward my long-term career goals."
};

// Load settings from storage
chrome.storage.local.get('userConfig', (data) => {
  if (data.userConfig) {
    USER_INFO = { ...USER_INFO, ...data.userConfig };
    console.log('Settings loaded from storage');
  }
});

// Auto-fill on page load
setTimeout(() => {
  autoFillPage();
}, 1500);

function autoFillPage() {
  console.log('Scanning for Workday fields...');
  let filled = 0;
  
  // ===== CREATE ACCOUNT PAGE =====
  filled += fillField('input[data-automation-id="email"]', USER_INFO.email);
  filled += fillField('input[data-automation-id="password"]', USER_INFO.password);
  filled += fillField('input[data-automation-id="verifyPassword"]', USER_INFO.password);
  
  // ===== NAME FIELDS =====
  filled += fillField('input[name="legalName--firstName"]', USER_INFO.firstName);
  filled += fillField('input[id*="firstName"]', USER_INFO.firstName);
  filled += fillField('input[name="legalName--lastName"]', USER_INFO.lastName);
  filled += fillField('input[id*="lastName"]', USER_INFO.lastName);
  
  // ===== ADDRESS FIELDS =====
  filled += fillField('input[name="addressLine1"]', USER_INFO.address);
  filled += fillField('input[id*="addressLine1"]', USER_INFO.address);
  filled += fillField('input[name="city"]', USER_INFO.city);
  filled += fillField('input[id*="city"]', USER_INFO.city);
  filled += fillField('input[name="postalCode"]', USER_INFO.postalCode);
  filled += fillField('input[id*="postalCode"]', USER_INFO.postalCode);
  
  // ===== STATE DROPDOWN =====
  filled += selectDropdown('button[name="countryRegion"]', USER_INFO.state);
  filled += selectDropdown('select[name="countryRegion"]', USER_INFO.state);
  
  // ===== COUNTRY (usually pre-filled) =====
  filled += selectDropdown('button[name="country"]', USER_INFO.country);
  
  // ===== PHONE =====
  filled += fillField('input[name="phoneNumber"]', USER_INFO.phone);
  filled += fillField('input[id*="phoneNumber"]', USER_INFO.phone);
  filled += selectDropdown('button[name="phoneType"]', USER_INFO.phoneType);
  filled += selectDropdown('select[name="phoneType"]', USER_INFO.phoneType);
  
  // ===== PREVIOUS EMPLOYEE RADIO =====
  filled += selectRadio('candidateIsPreviousWorker', USER_INFO.previousEmployee);
  
  // ===== COMMON YES/NO QUESTIONS =====
  filled += handleYesNoQuestion('authorized to work', USER_INFO.authorizedToWork);
  filled += handleYesNoQuestion('require sponsorship', USER_INFO.needSponsorship);
  filled += handleYesNoQuestion('willing to relocate', USER_INFO.willingToRelocate);
  filled += handleYesNoQuestion('legally authorized', USER_INFO.authorizedToWork);
  filled += handleYesNoQuestion('work authorization', USER_INFO.authorizedToWork);
  
  // ===== HOW DID YOU HEAR (searchable dropdown) =====
  filled += fillSearchableDropdown('input[id*="source"]', USER_INFO.howDidYouHear);
  
  // ===== QUESTIONNAIRE DROPDOWNS =====
  // These have dynamic IDs, so we match by button text and aria-label
  filled += selectQuestionnaireDropdown('visa sponsorship', USER_INFO.visaSponsorship);
  filled += selectQuestionnaireDropdown('salary', USER_INFO.salaryRange);
  filled += selectQuestionnaireDropdown('education', USER_INFO.education);
  
  // ===== TEXT AREAS (portfolio, etc) =====
  filled += fillTextArea('textarea[id*="primaryQuestionnaire"]', USER_INFO.portfolio);
  
  // ===== DEMOGRAPHICS (EEO) =====
  filled += selectDropdownByName('ethnicity', USER_INFO.race);
  filled += selectDropdownByName('gender', USER_INFO.gender);
  filled += selectDropdownByName('veteranStatus', 'not a veteran');
  filled += selectDropdownByName('disability', USER_INFO.disability);
  
  // ===== DISABILITY CHECKBOX =====
  filled += checkDisabilityBox();
  
  // ===== DISABILITY NAME FIELD =====
  filled += fillField('input[id*="selfIdentifiedDisabilityData--name"]', `${USER_INFO.firstName} ${USER_INFO.lastName}`);
  
  // ===== DATE FIELDS (set to today) =====
  filled += fillTodayDate();
  
  // ===== WORK EXPERIENCE =====
  filled += fillWorkExperience();
  
  // ===== EDUCATION =====
  filled += fillEducation();
  
  // ===== SKILLS =====
  filled += fillSkills();
  
  // ===== SOCIAL MEDIA =====
  filled += fillSocialMedia();
  
  // ===== ESSAY QUESTIONS =====
  filled += fillEssayQuestions();
  
  if (filled > 0) {
    showSuccessMessage(`Auto-filled ${filled} fields`);
    console.log(`Successfully filled ${filled} fields`);
  } else {
    console.log('No fields found on this page');
  }
}

// Fill regular text input
function fillField(selector, value) {
  const field = document.querySelector(selector);
  if (field && !field.value) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new Event('blur', { bubbles: true }));
    console.log(`Filled: ${selector}`);
    return 1;
  }
  return 0;
}

// Select dropdown (button-based Workday dropdowns)
function selectDropdown(selector, value) {
  const button = document.querySelector(selector);
  if (!button) return 0;
  
  // Click to open dropdown
  button.click();
  
  setTimeout(() => {
    // Find option in dropdown - try multiple selectors for Workday's various dropdown styles
    const options = document.querySelectorAll(`
      [role="option"],
      [role="listbox"] > div,
      [role="listbox"] li,
      ul[role="listbox"] > li,
      div[data-automation-id*="option"],
      .css-1szy77t
    `);
    
    console.log(`Found ${options.length} options in dropdown`);
    
    for (const option of options) {
      const optionText = option.textContent.trim().toLowerCase();
      const searchValue = value.toLowerCase();
      
      // Match if option text contains the search value or vice versa
      if (optionText.includes(searchValue) || searchValue.includes(optionText)) {
        console.log(`Clicking option: ${option.textContent.trim()}`);
        option.click();
        console.log(`Selected dropdown: ${value}`);
        return;
      }
    }
    
    console.log(`No matching option found for: ${value}`);
  }, 600); // Increased timeout
  
  return 1;
}

// Select radio button
function selectRadio(name, value) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  for (const radio of radios) {
    const label = document.querySelector(`label[for="${radio.id}"]`);
    if (label && label.textContent.trim().toLowerCase() === value.toLowerCase()) {
      radio.click();
      console.log(`Selected radio: ${value}`);
      return 1;
    }
  }
  return 0;
}

// Handle Yes/No questions by finding the question text
function handleYesNoQuestion(questionKeyword, answer) {
  // Find all radio buttons
  const allRadios = document.querySelectorAll('input[type="radio"]');
  
  for (const radio of allRadios) {
    // Get the question text near this radio
    const questionText = findQuestionLabel(radio).toLowerCase();
    
    // If question contains our keyword
    if (questionText.includes(questionKeyword.toLowerCase())) {
      // Find the label for this radio
      const label = document.querySelector(`label[for="${radio.id}"]`);
      if (!label) continue;
      
      const labelText = label.textContent.trim().toLowerCase();
      
      // Match the answer
      if ((answer.toLowerCase() === 'yes' && labelText.includes('yes')) ||
          (answer.toLowerCase() === 'no' && labelText.includes('no'))) {
        radio.click();
        console.log(`Answered "${questionKeyword}": ${answer}`);
        return 1;
      }
    }
  }
  
  // Also try dropdowns for the same questions
  const buttons = document.querySelectorAll('button[aria-haspopup="listbox"]');
  for (const button of buttons) {
    const label = button.getAttribute('aria-label') || '';
    const questionText = findQuestionLabel(button).toLowerCase();
    
    if (label.toLowerCase().includes(questionKeyword) || 
        questionText.includes(questionKeyword)) {
      // Click to open
      button.click();
      
      setTimeout(() => {
        const options = document.querySelectorAll('[role="option"]');
        for (const option of options) {
          const optionText = option.textContent.trim().toLowerCase();
          if ((answer.toLowerCase() === 'yes' && optionText.includes('yes')) ||
              (answer.toLowerCase() === 'no' && optionText.includes('no'))) {
            option.click();
            console.log(`Answered dropdown "${questionKeyword}": ${answer}`);
            return;
          }
        }
      }, 600);
      
      return 1;
    }
  }
  
  return 0;
}

// Fill searchable dropdown (like "How did you hear")
function fillSearchableDropdown(selector, value) {
  const input = document.querySelector(selector);
  if (!input) return 0;
  
  // Focus and type
  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  
  setTimeout(() => {
    // Select first option
    const firstOption = document.querySelector('[role="option"]');
    if (firstOption) {
      firstOption.click();
      console.log(`Selected: ${value}`);
    }
  }, 500);
  
  return 1;
}

// Check disability "No" checkbox
function checkDisabilityBox() {
  // Find label with "No, I do not have a disability" text
  const labels = document.querySelectorAll('label');
  for (const label of labels) {
    if (label.textContent.toLowerCase().includes('do not have a disability')) {
      const checkbox = document.getElementById(label.getAttribute('for'));
      if (checkbox && !checkbox.checked) {
        checkbox.click();
        console.log('Checked: No disability');
        return 1;
      }
    }
  }
  return 0;
}

// Fill today's date in date fields
function fillTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  
  let filled = 0;
  
  // Format: MM/DD/YYYY
  const dateStr = `${month}/${day}/${year}`;
  
  // Find date inputs
  const dateInputs = document.querySelectorAll('input[type="date"], input[placeholder*="date" i], input[aria-label*="date" i]');
  
  for (const input of dateInputs) {
    if (!input.value && !input.disabled) {
      input.value = dateStr;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Filled date: ' + dateStr);
      filled++;
    }
  }
  
  // Also try ISO format for type="date"
  const isoDate = `${year}-${month}-${day}`;
  const isoDateInputs = document.querySelectorAll('input[type="date"]');
  
  for (const input of isoDateInputs) {
    if (!input.value && !input.disabled) {
      input.value = isoDate;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Filled ISO date: ' + isoDate);
      filled++;
    }
  }
  
  return filled;
}

// Select dropdown by exact name attribute (for demographics)
function selectDropdownByName(name, value) {
  const button = document.querySelector(`button[name="${name}"]`);
  if (!button) return 0;
  
  // Click to open dropdown
  button.click();
  
  setTimeout(() => {
    // Find option matching the value - use multiple selectors
    const options = document.querySelectorAll(`
      [role="option"],
      [role="listbox"] > div,
      [role="listbox"] li,
      ul[role="listbox"] > li,
      .css-1szy77t
    `);
    
    console.log(`Found ${options.length} options for ${name}`);
    
    for (const option of options) {
      const optionText = option.textContent.trim().toLowerCase();
      const searchValue = value.toLowerCase();
      
      if (optionText.includes(searchValue) || searchValue.includes(optionText)) {
        console.log(`Clicking ${name}: ${option.textContent.trim()}`);
        option.click();
        console.log(`Selected ${name}: ${value}`);
        return;
      }
    }
    
    console.log(`No matching option found for ${name}: ${value}`);
  }, 600); // Increased timeout
  
  return 1;
}

// Select questionnaire dropdown by question text
function selectQuestionnaireDropdown(questionKeyword, value) {
  // Find all buttons that are dropdowns
  const buttons = document.querySelectorAll('button[aria-haspopup="listbox"]');
  
  for (const button of buttons) {
    const label = button.getAttribute('aria-label') || '';
    const prevText = getPreviousText(button);
    
    // Check if this button matches our question
    if (label.toLowerCase().includes(questionKeyword) || 
        prevText.toLowerCase().includes(questionKeyword)) {
      
      // Click to open dropdown
      button.click();
      
      setTimeout(() => {
        // Find the option with our value
        const options = document.querySelectorAll('[role="option"]');
        for (const option of options) {
          const optionText = option.textContent.trim();
          if (optionText.toLowerCase().includes(value.toLowerCase()) ||
              value.toLowerCase().includes(optionText.toLowerCase())) {
            option.click();
            console.log(`Selected ${questionKeyword}: ${value}`);
            return;
          }
        }
      }, 300);
      
      return 1;
    }
  }
  return 0;
}

// Get text before an element (the question label)
function getPreviousText(element) {
  let current = element;
  let text = '';
  
  // Go up to find the question text
  for (let i = 0; i < 5; i++) {
    current = current.parentElement;
    if (!current) break;
    
    const labels = current.querySelectorAll('label, div, span');
    for (const label of labels) {
      if (label.contains(element)) continue;
      text += ' ' + label.textContent;
    }
    
    if (text.length > 20) break;
  }
  
  return text;
}

// Fill textarea
function fillTextArea(selector, value) {
  if (!value) return 0; // Skip if empty
  
  const textarea = document.querySelector(selector);
  if (textarea && !textarea.value) {
    textarea.value = value;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    console.log(`Filled textarea`);
    return 1;
  }
  return 0;
}

// Fill work experience
function fillWorkExperience() {
  if (!USER_INFO.workExperiences || USER_INFO.workExperiences.length === 0) return 0;
  
  const exp = USER_INFO.workExperiences[0]; // Fill first work experience
  let filled = 0;
  
  // Job title
  filled += fillField('input[name="jobTitle"]', exp.jobTitle);
  filled += fillField('input[id*="jobTitle"]', exp.jobTitle);
  
  // Company name
  filled += fillField('input[name="companyName"]', exp.company);
  filled += fillField('input[id*="companyName"]', exp.company);
  
  // Location
  filled += fillField('input[name="location"]', exp.location);
  filled += fillField('input[id*="workExperience"][id*="location"]', exp.location);
  
  // Currently working checkbox
  if (exp.currentlyWorking) {
    const checkbox = document.querySelector('input[name="currentlyWorkHere"]');
    if (checkbox && !checkbox.checked) {
      checkbox.click();
      console.log('Checked: Currently working here');
      filled++;
    }
  }
  
  // Start date (MM/YYYY format)
  if (exp.startMonth && exp.startYear) {
    filled += fillWorkdayDate('startDate', exp.startMonth, exp.startYear);
  }
  
  // End date (only if not currently working)
  if (!exp.currentlyWorking && exp.endMonth && exp.endYear) {
    filled += fillWorkdayDate('endDate', exp.endMonth, exp.endYear);
  }
  
  // Description
  filled += fillField('textarea[id*="roleDescription"]', exp.description);
  
  return filled;
}

// Fill Workday's special date format (MM/YYYY)
function fillWorkdayDate(dateType, month, year) {
  let filled = 0;
  
  // Find month input
  const monthInput = document.querySelector(`input[id*="${dateType}"][id*="Month-input"]`);
  if (monthInput) {
    monthInput.value = month;
    monthInput.dispatchEvent(new Event('input', { bubbles: true }));
    filled++;
  }
  
  // Find year input
  const yearInput = document.querySelector(`input[id*="${dateType}"][id*="Year-input"]`);
  if (yearInput) {
    yearInput.value = year;
    yearInput.dispatchEvent(new Event('input', { bubbles: true }));
    filled++;
  }
  
  if (filled > 0) {
    console.log(`Filled ${dateType}: ${month}/${year}`);
  }
  
  return filled > 0 ? 1 : 0;
}

// Fill education
function fillEducation() {
  let filled = 0;
  
  // School (searchable)
  const schoolInput = document.querySelector('input[id*="education"][id*="school"]');
  if (schoolInput && !schoolInput.value) {
    schoolInput.focus();
    schoolInput.value = USER_INFO.school;
    schoolInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled school');
    filled++;
    
    // Wait and select first option
    setTimeout(() => {
      const firstOption = document.querySelector('[role="option"]');
      if (firstOption) firstOption.click();
    }, 500);
  }
  
  // Degree dropdown
  filled += selectDropdownByName('degree', USER_INFO.degree);
  
  // Field of study (searchable)
  const fieldInput = document.querySelector('input[id*="fieldOfStudy"]');
  if (fieldInput && !fieldInput.value) {
    fieldInput.focus();
    fieldInput.value = USER_INFO.fieldOfStudy;
    fieldInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled field of study');
    filled++;
  }
  
  // GPA
  filled += fillField('input[name="gradeAverage"]', USER_INFO.gpa);
  filled += fillField('input[id*="gradeAverage"]', USER_INFO.gpa);
  
  // Start year
  const startYearInput = document.querySelector('input[id*="firstYearAttended"][id*="Year-input"]');
  if (startYearInput) {
    startYearInput.value = USER_INFO.startYear;
    startYearInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled start year');
    filled++;
  }
  
  // End year
  const endYearInput = document.querySelector('input[id*="lastYearAttended"][id*="Year-input"]');
  if (endYearInput) {
    endYearInput.value = USER_INFO.endYear;
    endYearInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled end year');
    filled++;
  }
  
  return filled;
}

// Fill skills
function fillSkills() {
  if (!USER_INFO.skills || USER_INFO.skills.length === 0) return 0;
  
  const skillsInput = document.querySelector('input[id*="skills"]');
  if (!skillsInput) return 0;
  
  let filled = 0;
  
  // Add each skill
  USER_INFO.skills.forEach((skill, index) => {
    setTimeout(() => {
      skillsInput.focus();
      skillsInput.value = skill;
      skillsInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      setTimeout(() => {
        // Press Enter or click first option
        const firstOption = document.querySelector('[role="option"]');
        if (firstOption) {
          firstOption.click();
        } else {
          skillsInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
      }, 300);
    }, index * 1000);
  });
  
  console.log(`Adding ${USER_INFO.skills.length} skills`);
  return 1;
}

// Fill social media
function fillSocialMedia() {
  let filled = 0;
  
  if (USER_INFO.linkedin) {
    filled += fillField('input[name="linkedInAccount"]', USER_INFO.linkedin);
    filled += fillField('input[id*="linkedInAccount"]', USER_INFO.linkedin);
  }
  
  if (USER_INFO.twitter) {
    filled += fillField('input[name="twitterAccount"]', USER_INFO.twitter);
    filled += fillField('input[id*="twitterAccount"]', USER_INFO.twitter);
  }
  
  if (USER_INFO.facebook) {
    filled += fillField('input[name="facebookAccount"]', USER_INFO.facebook);
    filled += fillField('input[id*="facebookAccount"]', USER_INFO.facebook);
  }
  
  return filled;
}

// Fill essay questions
function fillEssayQuestions() {
  let filled = 0;
  
  // Find all textareas that might be essay questions
  const textareas = document.querySelectorAll('textarea');
  
  for (const textarea of textareas) {
    if (textarea.value) continue; // Skip if already filled
    
    // Get the question text
    const label = findQuestionLabel(textarea);
    const questionText = label.toLowerCase();
    
    // Match question to appropriate answer
    if (questionText.includes('why') && questionText.includes('join')) {
      textarea.value = USER_INFO.whyJoinUs;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Filled: Why join us');
      filled++;
    } else if (questionText.includes('why') && (questionText.includes('company') || questionText.includes('organization'))) {
      textarea.value = USER_INFO.whyThisCompany;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Filled: Why this company');
      filled++;
    } else if (questionText.includes('career') && questionText.includes('goal')) {
      textarea.value = USER_INFO.careerGoals;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Filled: Career goals');
      filled++;
    }
  }
  
  return filled;
}

// Find question label for a field
function findQuestionLabel(element) {
  // Try to find label by ID
  const id = element.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent;
  }
  
  // Search parent elements for question text
  let parent = element.parentElement;
  for (let i = 0; i < 5 && parent; i++) {
    const text = parent.textContent;
    if (text && text.length > 10 && text.length < 500) {
      return text;
    }
    parent = parent.parentElement;
  }
  
  return '';
}

// Show success message
function showSuccessMessage(text) {
  const existing = document.getElementById('workday-autofill-success');
  if (existing) existing.remove();
  
  const div = document.createElement('div');
  div.id = 'workday-autofill-success';
  div.textContent = text;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #000;
    color: #fff;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 1px solid #333;
  `;
  document.body.appendChild(div);
  
  setTimeout(() => div.remove(), 3000);
}

// Listen for manual fill button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillPage') {
    autoFillPage();
    sendResponse({ success: true });
  }
  return true;
});
