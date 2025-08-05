const validateAgent = ({fullName, email, phoneNumer, password})=>{
    const errors = {};

    if(!fullName|| fullName.trim() === ''){
        errors.fullName = 'Full Name is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Invalid email format';
  }

  const phoneRegex = /^\d{11}$/; // Nigerian phone format
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'Phone number must be 11 digits';
  }

   if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
 return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateAgent;
