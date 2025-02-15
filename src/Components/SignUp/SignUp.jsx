import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Shared/auth.module.css';
import { useAuth } from '../../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    country_id: '',
    region_id: '',
    age: ''
  });
  const [errors, setErrors] = useState({});
  const { register, error: authError, message } = useAuth();

  // list with all world countries
  const countries = [
    { id: "1", name: "Afghanistan", code: "AF" },
    { id: "2", name: "Albania", code: "AL" },
    { id: "3", name: "Algeria", code: "DZ" },
    { id: "4", name: "Andorra", code: "AD" },
    { id: "5", name: "Angola", code: "AO" },
    { id: "6", name: "Antigua and Barbuda", code: "AG" },
    { id: "7", name: "Argentina", code: "AR" },
    { id: "8", name: "Armenia", code: "AM" },
    { id: "9", name: "Australia", code: "AU" },
    { id: "10", name: "Austria", code: "AT" },
    { id: "11", name: "Azerbaijan", code: "AZ" },
    { id: "12", name: "Bahamas", code: "BS" },
    { id: "13", name: "Bahrain", code: "BH" },
    { id: "14", name: "Bangladesh", code: "BD" },
    { id: "15", name: "Barbados", code: "BB" },
    { id: "16", name: "Belarus", code: "BY" },
    { id: "17", name: "Belgium", code: "BE" },
    { id: "18", name: "Belize", code: "BZ" },
    { id: "19", name: "Benin", code: "BJ" },
    { id: "20", name: "Bhutan", code: "BT" },
    { id: "21", name: "Bolivia", code: "BO" },
    { id: "22", name: "Bosnia and Herzegovina", code: "BA" },
    { id: "23", name: "Botswana", code: "BW" },
    { id: "24", name: "Brazil", code: "BR" },
    { id: "25", name: "Brunei", code: "BN" },
    { id: "26", name: "Bulgaria", code: "BG" },
    { id: "27", name: "Burkina Faso", code: "BF" },
    { id: "28", name: "Burundi", code: "BI" },
    { id: "29", name: "Cabo Verde", code: "CV" },
    { id: "30", name: "Cambodia", code: "KH" },
    { id: "31", name: "Cameroon", code: "CM" },
    { id: "32", name: "Canada", code: "CA" },
    { id: "33", name: "Central African Republic", code: "CF" },
    { id: "34", name: "Chad", code: "TD" },
    { id: "35", name: "Chile", code: "CL" },
    { id: "36", name: "China", code: "CN" },
    { id: "37", name: "Colombia", code: "CO" },
    { id: "38", name: "Comoros", code: "KM" },
    { id: "39", name: "Congo", code: "CG" },
    { id: "40", name: "Costa Rica", code: "CR" },
    { id: "41", name: "Croatia", code: "HR" },
    { id: "42", name: "Cuba", code: "CU" },
    { id: "43", name: "Cyprus", code: "CY" },
    { id: "44", name: "Czech Republic", code: "CZ" },
    { id: "45", name: "Denmark", code: "DK" },
    { id: "46", name: "Djibouti", code: "DJ" },
    { id: "47", name: "Dominica", code: "DM" },
    { id: "48", name: "Dominican Republic", code: "DO" },
    { id: "49", name: "Ecuador", code: "EC" },
    { id: "50", name: "Egypt", code: "EG" },
    { id: "51", name: "El Salvador", code: "SV" },
    { id: "52", name: "Equatorial Guinea", code: "GQ" },
    { id: "53", name: "Eritrea", code: "ER" },
    { id: "54", name: "Estonia", code: "EE" },
    { id: "55", name: "Eswatini", code: "SZ" },
    { id: "56", name: "Ethiopia", code: "ET" },
    { id: "57", name: "Fiji", code: "FJ" },
    { id: "58", name: "Finland", code: "FI" },
    { id: "59", name: "France", code: "FR" },
    { id: "60", name: "Gabon", code: "GA" },
    { id: "61", name: "Gambia", code: "GM" },
    { id: "62", name: "Georgia", code: "GE" },
    { id: "63", name: "Germany", code: "DE" },
    { id: "64", name: "Ghana", code: "GH" },
    { id: "65", name: "Greece", code: "GR" },
    { id: "66", name: "Grenada", code: "GD" },
    { id: "67", name: "Guatemala", code: "GT" },
    { id: "68", name: "Guinea", code: "GN" },
    { id: "69", name: "Guinea-Bissau", code: "GW" },
    { id: "70", name: "Guyana", code: "GY" },
    { id: "71", name: "Haiti", code: "HT" },
    { id: "72", name: "Honduras", code: "HN" },
    { id: "73", name: "Hungary", code: "HU" },
    { id: "74", name: "Iceland", code: "IS" },
    { id: "75", name: "India", code: "IN" },
    { id: "76", name: "Indonesia", code: "ID" },
    { id: "77", name: "Iran", code: "IR" },
    { id: "78", name: "Iraq", code: "IQ" },
    { id: "79", name: "Ireland", code: "IE" },
    { id: "80", name: "Israel", code: "IL" },
    { id: "81", name: "Italy", code: "IT" },
    { id: "82", name: "Jamaica", code: "JM" },
    { id: "83", name: "Japan", code: "JP" },
    { id: "84", name: "Jordan", code: "JO" },
    { id: "85", name: "Kazakhstan", code: "KZ" },
    { id: "86", name: "Kenya", code: "KE" },
    { id: "87", name: "Kiribati", code: "KI" },
    { id: "88", name: "Kuwait", code: "KW" },
    { id: "89", name: "Kyrgyzstan", code: "KG" },
    { id: "90", name: "Laos", code: "LA" },
    { id: "91", name: "Latvia", code: "LV" },
    { id: "92", name: "Lebanon", code: "LB" },
    { id: "93", name: "Lesotho", code: "LS" },
    { id: "94", name: "Liberia", code: "LR" },
    { id: "95", name: "Libya", code: "LY" },
    { id: "96", name: "Liechtenstein", code: "LI" },
    { id: "97", name: "Lithuania", code: "LT" },
    { id: "98", name: "Luxembourg", code: "LU" },
    { id: "99", name: "Madagascar", code: "MG" },
    { id: "100", name: "Malawi", code: "MW" },
    { id: "101", name: "Malaysia", code: "MY" },
    { id: "102", name: "Maldives", code: "MV" },
    { id: "103", name: "Mali", code: "ML" },
    { id: "104", name: "Malta", code: "MT" },
    { id: "105", name: "Marshall Islands", code: "MH" },
    { id: "106", name: "Mauritania", code: "MR" },
    { id: "107", name: "Mauritius", code: "MU" },
    { id: "108", name: "Mexico", code: "MX" },
    { id: "109", name: "Micronesia", code: "FM" },
    { id: "110", name: "Moldova", code: "MD" },
    { id: "111", name: "Monaco", code: "MC" },
    { id: "112", name: "Mongolia", code: "MN" },
    { id: "113", name: "Montenegro", code: "ME" },
    { id: "114", name: "Morocco", code: "MA" },
    { id: "115", name: "Mozambique", code: "MZ" },
    { id: "116", name: "Myanmar", code: "MM" },
    { id: "117", name: "Namibia", code: "NA" },
    { id: "118", name: "Nauru", code: "NR" },
    { id: "119", name: "Nepal", code: "NP" },
    { id: "120", name: "Netherlands", code: "NL" },
    { id: "121", name: "New Zealand", code: "NZ" },
    { id: "122", name: "Nicaragua", code: "NI" },
    { id: "123", name: "Niger", code: "NE" },
    { id: "124", name: "Nigeria", code: "NG" },
    { id: "125", name: "North Korea", code: "KP" },
    { id: "126", name: "North Macedonia", code: "MK" },
    { id: "127", name: "Norway", code: "NO" },
    { id: "128", name: "Oman", code: "OM" },
    { id: "129", name: "Pakistan", code: "PK" },
    { id: "130", name: "Palau", code: "PW" },
    { id: "131", name: "Palestine", code: "PS" },
    { id: "132", name: "Panama", code: "PA" },
    { id: "133", name: "Papua New Guinea", code: "PG" },
    { id: "134", name: "Paraguay", code: "PY" },
    { id: "135", name: "Peru", code: "PE" },
    { id: "136", name: "Philippines", code: "PH" },
    { id: "137", name: "Poland", code: "PL" },
    { id: "138", name: "Portugal", code: "PT" },
    { id: "139", name: "Qatar", code: "QA" },
    { id: "140", name: "Romania", code: "RO" },
    { id: "141", name: "Russia", code: "RU" },
    { id: "142", name: "Rwanda", code: "RW" },
    { id: "143", name: "Saint Kitts and Nevis", code: "KN" },
    { id: "144", name: "Saint Lucia", code: "LC" },
    { id: "145", name: "Saint Vincent and the Grenadines", code: "VC" },
    { id: "146", name: "Samoa", code: "WS" },
    { id: "147", name: "San Marino", code: "SM" },
    { id: "148", name: "Sao Tome and Principe", code: "ST" },
    { id: "149", name: "Saudi Arabia", code: "SA" },
    { id: "150", name: "Senegal", code: "SN" },
    { id: "151", name: "Serbia", code: "RS" },
    { id: "152", name: "Seychelles", code: "SC" },
    { id: "153", name: "Sierra Leone", code: "SL" },
    { id: "154", name: "Singapore", code: "SG" },
    { id: "155", name: "Slovakia", code: "SK" },
    { id: "156", name: "Slovenia", code: "SI" },
    { id: "157", name: "Solomon Islands", code: "SB" },
    { id: "158", name: "Somalia", code: "SO" },
    { id: "159", name: "South Africa", code: "ZA" },
    { id: "160", name: "South Korea", code: "KR" },
    { id: "161", name: "South Sudan", code: "SS" },
    { id: "162", name: "Spain", code: "ES" },
    { id: "163", name: "Sri Lanka", code: "LK" },
    { id: "164", name: "Sudan", code: "SD" },
    { id: "165", name: "Suriname", code: "SR" },
    { id: "166", name: "Sweden", code: "SE" },
    { id: "167", name: "Switzerland", code: "CH" },
    { id: "168", name: "Syria", code: "SY" },
    { id: "169", name: "Taiwan", code: "TW" },
    { id: "170", name: "Tajikistan", code: "TJ" },
    { id: "171", name: "Tanzania", code: "TZ" },
    { id: "172", name: "Thailand", code: "TH" },
    { id: "173", name: "Timor-Leste", code: "TL" },
    { id: "174", name: "Togo", code: "TG" },
    { id: "175", name: "Tonga", code: "TO" },
    { id: "176", name: "Trinidad and Tobago", code: "TT" },
    { id: "177", name: "Tunisia", code: "TN" },
    { id: "178", name: "Turkey", code: "TR" },
    { id: "179", name: "Turkmenistan", code: "TM" },
    { id: "180", name: "Tuvalu", code: "TV" },
    { id: "181", name: "Uganda", code: "UG" },
    { id: "182", name: "Ukraine", code: "UA" },
    { id: "183", name: "United Arab Emirates", code: "AE" },
    { id: "184", name: "United Kingdom", code: "GB" },
    { id: "185", name: "United States", code: "US" },
    { id: "186", name: "Uruguay", code: "UY" },
    { id: "187", name: "Uzbekistan", code: "UZ" },
    { id: "188", name: "Vanuatu", code: "VU" },
    { id: "189", name: "Vatican City", code: "VA" },
    { id: "190", name: "Venezuela", code: "VE" },
    { id: "191", name: "Vietnam", code: "VN" },
    { id: "192", name: "Yemen", code: "YE" },
    { id: "193", name: "Zambia", code: "ZM" },
    { id: "194", name: "Zimbabwe", code: "ZW" }
  ];

  //  regions list 
  const regions = [
    { id: "1", name: "Cairo" },
    { id: "2", name: "Giza" },
    { id: "3", name: "Alexandria" },
    { id: "4", name: "Dakahlia" },
    { id: "5", name: "Red Sea" },
    { id: "6", name: "Beheira" },
    { id: "7", name: "Fayoum" },
    { id: "8", name: "Gharbiya" },
    { id: "9", name: "Ismailia" },
    { id: "10", name: "Menofia" },
    { id: "11", name: "Minya" },
    { id: "12", name: "Qaliubiya" },
    { id: "13", name: "New Valley" },
    { id: "14", name: "Suez" },
    { id: "15", name: "Aswan" },
    { id: "16", name: "Assiut" },
    { id: "17", name: "Beni Suef" },
    { id: "18", name: "Port Said" },
    { id: "19", name: "Damietta" },
    { id: "20", name: "Sharkia" },
    { id: "21", name: "South Sinai" },
    { id: "22", name: "Kafr Al sheikh" },
    { id: "23", name: "Matrouh" },
    { id: "24", name: "Luxor" },
    { id: "25", name: "Qena" },
    { id: "26", name: "North Sinai" },
    { id: "27", name: "Sohag" }
  ];

  const wrapperStyle = {
    position: 'relative',
    minHeight: '100vh', 
    overflow: 'hidden',
    zIndex: '0',
  };

  const diagonalStyle = {
    backgroundColor: '#e0f1f4',
    height: '50%',
    clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: '2',
  };

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [type === 'radio' ? 'gender' : id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.country_id) {
      newErrors.country_id = 'Please select a country';
    }

    if (!formData.region_id) {
      newErrors.region_id = 'Please select a region';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const { success, message } = await register(formData);
        if (success) {
          // Show success toast/alert
          console.log(message); // "Successfully registered"
          navigate('/login');
        }
      } catch (error) {
        setErrors({
          general: error.message
        });
      }
    }
  };

  // Add gender selection
  const renderGenderSelect = () => (
    <div className="mb-3">
      <label className="my-2" htmlFor="gender">
        Select Gender
      </label>
      <div className="d-flex gap-4">
        <div className="form-check">
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            className="form-check-input"
            checked={formData.gender === 'male'}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="male">
            Male
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            className="form-check-input"
            checked={formData.gender === 'female'}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="female">
            Female
          </label>
        </div>
      </div>
      {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
    </div>
  );

  // Add age input
  const renderAgeInput = () => (
    <div className="mb-3">
      <label className="my-2" htmlFor="age">
        Enter Your Age
      </label>
      <input
        type="number"
        id="age"
        className={`form-control m-auto rounded-3 ${styles.formInput} ${errors.age ? 'is-invalid' : ''}`}
        value={formData.age}
        onChange={handleInputChange}
        min="1"
        max="120"
      />
      {errors.age && <div className="invalid-feedback">{errors.age}</div>}
    </div>
  );

  // Add country selection
  const renderCountrySelect = () => (
    <div className="mb-3">
      <label className="my-2" htmlFor="country_id">
        Select Country
      </label>
      <select
        id="country_id"
        className={`form-control m-auto rounded-3 ${styles.formInput} ${errors.country_id ? 'is-invalid' : ''}`}
        value={formData.country_id}
        onChange={handleInputChange}
      >
        <option value="">Select a country</option>
        {countries.map(country => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      {errors.country_id && <div className="invalid-feedback">{errors.country_id}</div>}
    </div>
  );

  // Add region selection
  const renderRegionSelect = () => (
    <div className="mb-3">
      <label className="my-2" htmlFor="region_id">
        Select Region
      </label>
      <select
        id="region_id"
        className={`form-control m-auto rounded-3 ${styles.formInput} ${errors.region_id ? 'is-invalid' : ''}`}
        value={formData.region_id}
        onChange={handleInputChange}
      >
        <option value="">Select a region</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
      {errors.region_id && <div className="invalid-feedback">{errors.region_id}</div>}
    </div>
  );

  return (
    <>
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            content: '""',
            top: '10px', 
            left: '10px', 
            right: 0,
            height: '500px',
            backgroundColor: '#000',
            opacity: '0.05',
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)',
            zIndex: '1',
          }}
        ></div>

        <div style={diagonalStyle}></div>

         <div className="background-balls">
          <div
          /*bottom right */
            style={{
              position: 'absolute',
              bottom: '250px',
              right: '100px',
              width: '150px',
              height: '170px',
              backgroundColor: '#6ecdd4',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: '-2',
            }}
          ></div>
          <div
          /*bottom right */
            style={{
              position: 'absolute',
              bottom: '50%',
              right: '45%',
              width: '150px',
              height: '170px',
              backgroundColor: '#6ecdd4',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: '3',
            }}
          ></div>
          <div
          /*bottom left */
            style={{
              position: 'absolute',
              bottom: '250px',
              left: '300px',
              width: '150px',
              height: '170px',
              backgroundColor: '#3168BAA6   ',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: '-2',
            }}
          ></div>
          <div 
          /*top right */
            style={{
              position: 'absolute',
              top: '50px',
              right: '50px',
              width: '150px',
              height: '170px',
              backgroundColor: '#3168BAA6',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: '2',
            }}
          ></div>
          <div
          /*top left */
            style={{
              position: 'absolute',
              top: '100px',
              left: '60px',
              width: '150px',
              height: '170px',
              backgroundColor: '#6ecdd4',
              borderRadius: '50%',
              filter: 'blur(30px)',
              zIndex: '2',
            }}
          ></div>
        </div>

        <div className="container d-flex align-items-center justify-content-center" style={{ position: 'relative', zIndex: '3' }}>
          <div className="row w-100">
            <div className="col-md-6">
              <img
                src={require('./../../Images/pngwing.com.png')}
                className="w-25 pt-5"
                alt="LMS Logo"
              />
              <h3 className={`${styles.signupto} pt-5`}>
                Sign up to{' '}
              </h3>
              <h2 className={styles.headline}>
                Learning Management System
              </h2>
            </div>
            <div className="col-md-6">
              <h2 className={`${styles.welcome} text-center pt-5`}>
                Welcome back
              </h2>

              <form onSubmit={handleSubmit} className="pt-5 w-75 mt-5 m-auto bg-white rounded-5 p-4">
                <div className="row">
                  <div className="col-md-7">
                    <h5>Welcome to <span className={styles.LMS}>LMS</span></h5>
                    <h2 className={`${styles.signin} pb-4`}>
                      Sign Up
                    </h2>
                  </div>
                  <div className="col-md-5">
                    <h6 style={{fontSize:"15px"}}>Have an Account?</h6>
                    <Link className={`${styles.authLink} text-decoration-none`} to='/login'>
                      Sign in
                    </Link>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="my-2" htmlFor="email">
                    Enter your username or email address
                  </label>
                  <input 
                    placeholder="User name or email" 
                    type="email" 
                    id="email" 
                    className={`form-control m-auto rounded-3 ${styles.formInput} ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="row">
                    <div className="col-md-6 py-4">
                    <label className=" my-2" htmlFor="name">
                  Your Name
                </label>
                <input 
                  placeholder="Your Name" 
                  type="text" 
                  id="name" 
                  className={`form-control m-auto rounded-3 pt w-100 ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}

                    </div>
                    <div className="col-md-6 py-4">
                <label className=" my-2" htmlFor="phone">
                  Contact Number
                </label>
                <input 
                  placeholder="Contact Number" 
                  type="tel" 
                  id="phone" 
                  className={`form-control m-auto rounded-3 pt w-100 ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

               </div>
                </div>
               
                
                <div className="mb-3">
                  <label className="my-2" htmlFor="password">
                    Enter Your Password
                  </label>
                  <input 
                    placeholder="Password" 
                    type="password" 
                    id="password" 
                    className={`form-control m-auto rounded-3 pt w-100 ${errors.password ? 'is-invalid' : ''}`}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-3">
                  <label className="my-2" htmlFor="confirmPassword">
                    Confirm Your Password
                  </label>
                  <input 
                    placeholder="Confirm Password" 
                    type="password" 
                    id="confirmPassword" 
                    className={`form-control m-auto rounded-3 pt w-100 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                {renderGenderSelect()}
                {renderAgeInput()}
                {renderCountrySelect()}
                {renderRegionSelect()}

                {/* Show general error if any */}
                {errors.general && (
                  <div className="alert alert-danger">{errors.general}</div>
                )}
                {/* Show success message if any */}
                {message && (
                  <div className="alert alert-success">{message}</div>
                )}

                <button 
                  type="submit" 
                  className={`btn btn-outline-success w-100 mt-4 m-auto ${styles.submitButton}`}
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
