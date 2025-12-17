// Load current settings
document.addEventListener('DOMContentLoaded', loadSettings);

function loadSettings() {
  chrome.storage.local.get('userConfig', (data) => {
    if (data.userConfig) {
      const config = data.userConfig;
      document.getElementById('email').value = config.email || '';
      document.getElementById('password').value = config.password || '';
      document.getElementById('firstName').value = config.firstName || '';
      document.getElementById('lastName').value = config.lastName || '';
      document.getElementById('address').value = config.address || '';
      document.getElementById('city').value = config.city || '';
      document.getElementById('state').value = config.state || '';
      document.getElementById('postalCode').value = config.postalCode || '';
      document.getElementById('phone').value = config.phone || '';
      document.getElementById('phoneType').value = config.phoneType || 'Mobile';
      document.getElementById('authorizedToWork').value = config.authorizedToWork || 'Yes';
      document.getElementById('visaSponsorship').value = config.visaSponsorship || 'No';
      document.getElementById('willingToRelocate').value = config.willingToRelocate || 'Yes';
      document.getElementById('salaryRange').value = config.salaryRange || '';
      document.getElementById('education').value = config.education || '';
      document.getElementById('howDidYouHear').value = config.howDidYouHear || '';
      document.getElementById('race').value = config.race || '';
      document.getElementById('gender').value = config.gender || '';
      
      // Work experience
      if (config.workExperiences && config.workExperiences[0]) {
        const exp = config.workExperiences[0];
        document.getElementById('jobTitle').value = exp.jobTitle || '';
        document.getElementById('company').value = exp.company || '';
        document.getElementById('workLocation').value = exp.location || '';
        document.getElementById('workStartDate').value = `${exp.startMonth}/${exp.startYear}` || '';
        document.getElementById('currentlyWorking').value = exp.currentlyWorking ? 'true' : 'false';
        document.getElementById('jobDescription').value = exp.description || '';
      }
      
      // Education
      document.getElementById('school').value = config.school || '';
      document.getElementById('degree').value = config.degree || '';
      document.getElementById('fieldOfStudy').value = config.fieldOfStudy || '';
      document.getElementById('gpa').value = config.gpa || '';
      document.getElementById('eduStartYear').value = config.startYear || '';
      document.getElementById('eduEndYear').value = config.endYear || '';
      
      // Skills & social
      document.getElementById('skills').value = config.skills ? config.skills.join(', ') : '';
      document.getElementById('linkedin').value = config.linkedin || '';
      
      // Essays
      document.getElementById('whyJoinUs').value = config.whyJoinUs || '';
      document.getElementById('whyThisCompany').value = config.whyThisCompany || '';
      document.getElementById('careerGoals').value = config.careerGoals || '';
    } else {
      loadDefaults();
    }
  });
}

function loadDefaults() {
  document.getElementById('email').value = 'your.email@example.com';
  document.getElementById('password').value = 'YourPassword123!';
  document.getElementById('firstName').value = 'John';
  document.getElementById('lastName').value = 'Doe';
  document.getElementById('address').value = '123 Main Street Apt 1';
  document.getElementById('city').value = 'Your City';
  document.getElementById('state').value = 'Your State';
  document.getElementById('postalCode').value = '12345';
  document.getElementById('phone').value = '(555) 123-4567';
  document.getElementById('phoneType').value = 'Mobile';
  document.getElementById('authorizedToWork').value = 'Yes';
  document.getElementById('visaSponsorship').value = 'No';
  document.getElementById('willingToRelocate').value = 'Yes';
  document.getElementById('salaryRange').value = '$40,000 - $60,000';
  document.getElementById('education').value = "Bachelor's Degree";
  document.getElementById('howDidYouHear').value = 'LinkedIn';
  document.getElementById('race').value = 'Prefer not to say';
  document.getElementById('gender').value = 'Prefer not to say';
  
  // Work experience
  document.getElementById('jobTitle').value = 'Your Job Title';
  document.getElementById('company').value = 'Company Name';
  document.getElementById('workLocation').value = 'City, State';
  document.getElementById('workStartDate').value = '01/2024';
  document.getElementById('currentlyWorking').value = 'true';
  document.getElementById('jobDescription').value = 'Describe your job responsibilities and achievements here.';
  
  // Education
  document.getElementById('school').value = 'Your University';
  document.getElementById('degree').value = "Bachelor's Degree";
  document.getElementById('fieldOfStudy').value = 'Your Major';
  document.getElementById('gpa').value = '3.5';
  document.getElementById('eduStartYear').value = '2020';
  document.getElementById('eduEndYear').value = '2024';
  
  // Skills & social
  document.getElementById('skills').value = 'Skill 1, Skill 2, Skill 3, Skill 4';
  document.getElementById('linkedin').value = '';
  
  // Essays
  document.getElementById('whyJoinUs').value = 'I am passionate about this field and believe this opportunity will provide valuable hands-on experience. I\'m eager to contribute my skills while learning from industry professionals.';
  document.getElementById('whyThisCompany').value = 'Your company\'s commitment to innovation and excellence aligns perfectly with my career goals. I\'m particularly interested in your recent projects and would love to contribute to your team\'s success.';
  document.getElementById('careerGoals').value = 'I aim to develop my technical and professional skills while gaining practical experience in this industry. This position represents an important step toward my long-term career goals.';
}

// Save settings
document.getElementById('saveBtn').addEventListener('click', () => {
  // Parse work start date
  const workStart = document.getElementById('workStartDate').value.split('/');
  const startMonth = workStart[0] || '11';
  const startYear = workStart[1] || '2024';
  
  // Parse skills
  const skillsText = document.getElementById('skills').value;
  const skillsArray = skillsText ? skillsText.split(',').map(s => s.trim()) : [];
  
  const config = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    postalCode: document.getElementById('postalCode').value,
    phone: document.getElementById('phone').value,
    phoneType: document.getElementById('phoneType').value,
    visaSponsorship: document.getElementById('visaSponsorship').value,
    salaryRange: document.getElementById('salaryRange').value,
    education: document.getElementById('education').value,
    howDidYouHear: document.getElementById('howDidYouHear').value,
    race: document.getElementById('race').value,
    gender: document.getElementById('gender').value,
    country: 'United States of America',
    previousEmployee: 'No',
    authorizedToWork: document.getElementById('authorizedToWork').value,
    willingToRelocate: document.getElementById('willingToRelocate').value,
    veteran: 'No',
    disability: 'No',
    portfolio: '',
    
    // Work experience
    workExperiences: [{
      jobTitle: document.getElementById('jobTitle').value,
      company: document.getElementById('company').value,
      location: document.getElementById('workLocation').value,
      currentlyWorking: document.getElementById('currentlyWorking').value === 'true',
      startMonth: startMonth,
      startYear: startYear,
      endMonth: '',
      endYear: '',
      description: document.getElementById('jobDescription').value
    }],
    
    // Education
    school: document.getElementById('school').value,
    degree: document.getElementById('degree').value,
    fieldOfStudy: document.getElementById('fieldOfStudy').value,
    gpa: document.getElementById('gpa').value,
    startYear: document.getElementById('eduStartYear').value,
    endYear: document.getElementById('eduEndYear').value,
    
    // Skills & social
    skills: skillsArray,
    linkedin: document.getElementById('linkedin').value,
    twitter: '',
    facebook: '',
    
    // Essays
    whyJoinUs: document.getElementById('whyJoinUs').value,
    whyThisCompany: document.getElementById('whyThisCompany').value,
    careerGoals: document.getElementById('careerGoals').value
  };
  
  chrome.storage.local.set({ userConfig: config }, () => {
    showStatus('Settings saved successfully');
  });
});

// Export as JavaScript
document.getElementById('exportBtn').addEventListener('click', () => {
  const config = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    postalCode: document.getElementById('postalCode').value,
    phone: document.getElementById('phone').value,
    phoneType: document.getElementById('phoneType').value,
    visaSponsorship: document.getElementById('visaSponsorship').value,
    salaryRange: document.getElementById('salaryRange').value,
    education: document.getElementById('education').value,
    howDidYouHear: document.getElementById('howDidYouHear').value,
    race: document.getElementById('race').value,
    gender: document.getElementById('gender').value
  };
  
  const code = `const USER_INFO = ${JSON.stringify(config, null, 2)};`;
  
  const codeBlock = document.createElement('div');
  codeBlock.className = 'code-block';
  codeBlock.textContent = code;
  
  const output = document.getElementById('codeOutput');
  output.innerHTML = '';
  output.appendChild(codeBlock);
  
  showStatus('JavaScript code generated below');
});

function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status success';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
