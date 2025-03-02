/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axios from 'axios';
 
export async function authUser(user: any) {
  try {
    const { data } = await axios.post("http://localhost:4000/api/user/registration", { 
      email: user.email, 
      name: user.name,
      avatar: user.image
    });
    
    return data
  } catch (error: unknown) {
    console.log(error);
  }
} 