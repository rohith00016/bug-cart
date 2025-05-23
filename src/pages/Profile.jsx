import React, { useState, useEffect } from 'react';
import Title from '../components/Title';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    mobile: '',
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        firstName: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: user.country || '',
        mobile: user.mobile || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Updated Profile:', formData);

    // Optional: Send updated profile to backend and update sessionStorage
    sessionStorage.setItem('user', JSON.stringify(formData));
    alert("Profile updated!");
  };

  return (
    <div className='flex items-center justify-center min-h-[80vh] border-t pt-[5%] sm:pt-10'>
      <div className='flex flex-col gap-4 w-full max-w-[480px]'>
        <div className='text-xl sm:text-2xl text-center'>
          <Title text1={'PROFILE'} text2={'DETAILS'} />
        </div>

        <div className='flex gap-3'>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='First Name'
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='Last Name'
          />
        </div>

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="email"
          placeholder='Email Address'
        />

        <input
          name="street"
          value={formData.street}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="text"
          placeholder='Street'
        />

        <div className='flex gap-3'>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='City'
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='State'
          />
        </div>

        <div className='flex gap-3'>
          <input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="number"
            placeholder='Zip Code'
          />
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='Country'
          />
        </div>

        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="number"
          placeholder='Mobile'
        />

        <div className='w-full mt-4 text-end'>
          <button
            onClick={handleSave}
            className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'
          >
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
